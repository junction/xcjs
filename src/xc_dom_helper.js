/**
 * @namespace
 * Helper functions for XML DOM manipulation.
 *
 * <p>The IE DOM Core Level 2 is incomplete:</p>
 * <p>These functions were originally mixed into Node.prototype, however
 * IE doesn't implement the Node prototype, rather than bending over backwards
 * to make it look like it does I've accepted this instead...</p>
 * @see <a href="http://msdn.microsoft.com/en-us/library/dd282900%28VS.85%29.aspx#domproto">MSDN DOM prototypes</a>
 */
var XC_DOMHelper = {
  /**
   * An integer indicating which type of node this is.
   *
   * @see <a href="http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1950641247">NodeType Specification</a>
   */
  NodeTypes: {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  },

  xmlDocument: (function () {
    var doc = null;
    try {
      doc = document.implementation.createDocument('jabber:client', 'xcjs', null);
    } catch (x) {
      var msDocs = ["Msxml2.DOMDocument.6.0",
                    "Msxml2.DOMDocument.5.0",
                    "Msxml2.DOMDocument.4.0",
                    "MSXML2.DOMDocument.3.0",
                    "MSXML2.DOMDocument",
                    "MSXML.DOMDocument",
                    "Microsoft.XMLDOM"];
      for (var i = 0, len = msDocs.length; i < len; i++) {
        if (doc === null) {
          try {
            doc = new ActiveXObject(msDocs[i]);
          } catch (e) {
            doc = null;
          }
        } else {
          break;
        }
      }
    }
    return doc;
  }()),

  /**
   * Get the first child from a document fragment that is an Element.
   *
   * @param {Element|Node} el The document fragment to search.
   * @returns {Node|null} The node if it exists or null.
   */
  getFirstElementChild: function (el) {
    var nodeType = XC_DOMHelper.NodeTypes.ELEMENT_NODE;
    for (var i = 0, l = el.childNodes.length; i < l; i++) {
      if (el.childNodes[i].nodeType === nodeType) {
        return el.childNodes[i];
      }
    }
    return null;
  },

  /**
   * Retrieve all immediate children that have a XML namespace (xmlns) that
   * is matching the nsURI argument.
   *
   * @param {Element|Node} el The document fragment to search.
   * @param {String} nsURI The namespace URI to search for.
   * @returns {Element[]|Array} A list of elements or an empty array.
   */
  getElementsByNS: function (el, nsURI) {
    var ret = [];
    var nodeType = XC_DOMHelper.NodeTypes.ELEMENT_NODE;
    for (var i = 0, l = el.childNodes.length; i < l; i++) {
      if (el.childNodes[i].nodeType === nodeType &&
          el.childNodes[i].namespaceURI === nsURI) {
        ret.push(el.childNodes[i]);
      }
    }
    return ret;
  },

  /**
   * Retrieve all immediate children that have a XML tag name that
   * is matching the tagName argument.
   *
   * @param {Element|Node} el The document fragment to search.
   * @param {String} tagName The tagName to search for.
   * @returns {Element[]|Array} A list of elements or an empty array.
   */
  getElementsByTagName: function (el, tagName) {
    var ret = [], child,
        nodeType = XC_DOMHelper.NodeTypes.ELEMENT_NODE;
    for (var i = 0, l = el.childNodes.length; i < l; i++) {
      child = el.childNodes[i];
      if (child.nodeType === nodeType &&
          (child.localName || child.nodeName) === tagName) {
        ret.push(child);
      }
    }
    return ret;
  },

  /**
   * Get the text of an XML element.
   *
   * @param {Element|Node} el The document fragment to get the text of.
   * @returns {String} The inner text of the fragment.
   */
  getTextContent: function (el) {
    return el && (el.text || el.textContent);
  },

  /**
   * Set the text of an XML element.
   *
   * @param {Element|Node} el The document fragment to get the text of.
   * @param {String} text The inner text of the fragment.
   * @returns {void}
   */
  setTextContent: function (el, text) {
    if (el) {
      if ("textContent" in el) {
        el.textContent = text;
      } else {
        el.text = text;
      }
    }
  },

  /**
   * Serialize the Document / Element into a string.
   *
   * @param {Element|Node} node The document to serialize into a string.
   * @returns {String} The document fragment as a string.
   */
  serializeToString: function (node) {
    try {
      return (new XMLSerializer()).serializeToString(node);
    } catch (x) {
      return node.xml;
    }
  },

  /**
   * Internet Explorer doesn't implement createElementNS.
   *
   * @param {String} ns The namespace of the elment to create.
   * @param {String} tagName The name of the tag to create.
   * @returns {Element} The namespaced element.
   */
  createElementNS: function (ns, tagName) {
    if ("createElementNS" in document) {
      return this.xmlDocument.createElementNS(ns, tagName);
    } else {
      return this.xmlDocument.createNode(1, tagName, ns);
    }
  },

  /**
   * Import the node into the XML Document.
   *
   * @param {Element|Node} node The element to import into the document.
   * @param {Boolean} deep Whether to import all child nodes or not.
   * @returns {Element} The imported element (suitable for appending as a child).
   */
  importNode: function (node, deep) {
    var i, len, newNode, children;
    try {
      node = this.xmlDocument.importNode(node, deep);
    } catch (x) {
      switch (node.nodeType) {
      case XC_DOMHelper.NodeTypes.ELEMENT_NODE:
        if (node.namespaceURI) {
          newNode = this.createElementNS(node.namespaceURI, node.nodeName);
        } else {
          newNode = this.xmlDocument.createElement(node.nodeName);
        }
        if (node.attributes && node.attributes.length > 0) {
          for (i = 0, len = node.attributes.length; i < len; i++) {
            if (node.attributes[i].nodeName === 'xmlns') continue;
            newNode.setAttribute(node.attributes[i].nodeName,
                                 node.attributes[i].value);
          }
        }

        children = node.childNodes || node.children;
        if (deep && children && children.length > 0) {
          for (i = 0, len = children.length; i < len; i++) {
            newNode.appendChild(this.importNode(children[i], deep));
          }
        }
        break;
      case XC_DOMHelper.NodeTypes.TEXT_NODE:
      case XC_DOMHelper.NodeTypes.CDATA_SECTION_NODE:
      case XC_DOMHelper.NodeTypes.COMMENT_NODE:
        newNode = this.xmlDocument.createTextNode(node.nodeValue);
        break;
      }
      node = newNode;
    }
    return node;
  }
};
