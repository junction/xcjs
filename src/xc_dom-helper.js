/**
 * IE DOM Core Level 2 is incomplete:
 * @see http://msdn.microsoft.com/en-us/library/dd282900%28VS.85%29.aspx#domproto
 *
 * These functions were originally mixed into Node.prototype, however
 * IE doesn't implement the Node prototype, rather than bending over backwards
 * to make it look like it does I've accepted this instead...
 *
 */
XC_DOMHelper = {
  /**
   * @see
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

  getFirstElementChild: function (el) {
    var nodeType = XC_DOMHelper.NodeTypes.ELEMENT_NODE;
    for (var i = 0, l = el.childNodes.length; i < l; i++) {
      if (el.childNodes[i].nodeType === nodeType) {
        return el.childNodes[i];
      }
    }
    return null;
  },

  getElementsByNS: function(el, nsURI) {
    var ret = [];
    var nodeType = XC_DOMHelper.NodeTypes.ELEMENT_NODE;
    for (var i = 0, l = el.childNodes.length; i < l; i++) {
      if (el.childNodes[i].nodeType === nodeType && el.namespaceURI == nsURI) {
        ret.push(el);
      }
    }
    return ret;
  },

  getTextContent: function(el) {
    return el && (el.text || el.textContent);
  }
};
