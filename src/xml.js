/**
 * @namespace
 * Namespace for XML elements
 */
XC.XML = {};

/**
 * @class
 * A simple XML element class.
 *
 * @example
 *   var newElement = XC.XML.Element.extend({name: 'foo'});
 *   newElement.attr('bar', 'bam');
 *   newElement.addChild(XC.XML.Element.extend({name: 'child'}));
 *   newElement.toString();
 *   // -> '<foo bar="bam"><child></child></foo>'
 *
 * @extends XC.Base
 */
XC.XML.Element = XC.Base.extend(/** @lends XC.XML.Element# */{
  name: null,
  attributes: null,
  xmlns: null,
  children: null,
  text: null,

  /**
   * Get or set attributes on the receiver.
   *
   * @param {String} name The attributes name.
   * @param {String} [value] If value is supplied, the attribute will be set.
   * @returns {String} the value of the attribute.
   */
  attr: function (name, value) {
    this.attributes = this.attributes || {};
    if (value) {
      this.attributes[name] = value;
    }
    return this.attributes[name];
  },

  /**
   * Add a XML child element to the receiver.
   *
   * @param {XC.XML.Element} child The XML element to add as a child.
   * @returns {XC.XML.Element} The receiver.
   */
  addChild: function (child) {
    this.children = this.children || [];
    if (child) {
      this.children.push(child);
    }
    return this;
  },

  /**
   * @function
   * Escape XML characters to prevent parser errors.
   *
   * @param {String} string The string to escape.
   * @returns {String} The escaped string.
   */
  escapeXML: (function () {
    var character = {
      '"': '&quot;',
      "'": '&apos;',
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;'
    }, re = /[<>&"']/g;
    return function (str) {
      return str.replace(re, function (c) {
        return character[c];
      });
    };
  }()),

  /**
   * Return an XML string representation of this element.
   *
   * @returns {String} This XML element as XML text.
   */
  toString: function () {
    var ret = "";
    var attrs = [];

    if (this.xmlns) {
      this.attr('xmlns', this.xmlns);
    }

    if (this.attributes) {
      for (var name in this.attributes) {
        var val = this.attributes[name];
        if (!val) {
          continue;
        }

        attrs.push(name + '="' + this.escapeXML(val.toString()) + '"');
      }
    }

    ret += "<" + this.name;
    ret += (attrs.length > 0) ? ' ' + attrs.join(' ') : '';
    ret += ">";

    var children = this.children || [];
    for (var i = 0, len = children.length; i < len; i++) {
      ret += this.children[i].toString();
    }

    if (this.text) {
      ret += this.escapeXML(this.text.toString());
    }

    ret += "</" + this.name + ">";

    return ret;
  }
}, /** @lends XC.XML.Element */ {

  /**
   * Convenience function for creating a new XC.XML.Element and
   * setting attrs and elements in a single function
   *
   * @param {Object} [attrs] A hash of attribute names to attribute values.
   * @param {XC.XML.Element[]} [elements] An array of XC.XML.Element to assign as children.
   * @returns {XC.XML.Element}
   */
  create: function (attrs, elements) {
    var ret = this.extend();

    if (attrs) {
      for (var k in attrs) {
        if (attrs.hasOwnProperty(k)) {
          var v = attrs[k];
          if (!v) {
            continue;
          }
          ret.attr(k, v);
        }
      }
    }

    elements = (elements && elements.addChild) ? [elements] : elements;
    if (elements && elements.length) {
      for (var i = 0, len = elements.length; i < len; i++) {
        ret.addChild(elements[i]);
      }
    }

    return ret;
  },

  /**
   * Returns the XML given the JSON object.
   *
   * <code>xmlize</code> uses a custom format for
   * defining XML in a 1:1 manner.
   *
   * Any given element will be an object literal.
   * <ul>
   *   <li>The tag name of the element is scoped under <code>name</code>.</li>
   *   <li>The attributes of the element are scoped under <code>attrs</code>.</li>
   *   <li>The children of the element are scoped under <code>children</code>.</li>
   *   <li>The namespace of the element is scoped under <code>xmlns</code>.</li>
   *   <li>The text of the element is scoped under <code>text</code>.</li>
   * </ul>
   *
   * @param {Object} xml The XML in JSON notation.
   * @param {XC.XML.Element} stanza The root XML element to put the JSON XML in.
   * @returns XC.XML.Element The stanza passed in mutated by the XML.
   * @example
   *  XC.XML.Element.xmlize({
   *    attrs: {
   *      type: 'chat',
   *      to: 'mickey.moose@muppets.com'
   *    },
   *    children: [{
   *      name: 'subject',
   *      text: 'Chocolate Moose'
   *    }, {
   *      name: 'body',
   *      text: 'Yum yum yum for the chocolate.'
   *    }]
   *  }, XC.XML.XMPP.Message.extend());
   *
   *  // => <message type="chat" to="mickey.moose@muppets.com">
   *  //      <subject>Chocolate Moose</subject>
   *  //      <body>Yum yum yum for the chocolate.</body>
   *  //    </message>
   */
  xmlize: function (json, stanza, ignore) {
    var children = json.children, child,
        el, i, len;

    stanza.attributes = stanza.attributes || {};
    XC.Base.mixin.apply(stanza.attributes, [json.attrs]);
    stanza.text = json.text;
    stanza.name = json.name || stanza.name;
    stanza.xmlns = json.xmlns || stanza.xmlns;

    len = children ? children.length : 0;
    for (i = 0; i < len; i++) {
      child = children[i];
      el = XC.XML.Element.extend({ name: child.name });
      if (this.xmlize(child, el)) {
        stanza.addChild(el);
      }
    }

    return stanza;
  }
});

/**
 * @namespace
 * Namespace for XMPP XML elements.
 */
XC.XML.XMPP = {};

/**
 * @class
 * Generic XMPP stanza.
 *
 * @extends XC.XML.Element
 * @see <a href="http://xmpp.org/rfcs/rfc3920.html#stanzas">XMPP Core: Stanzas</a>
 */
XC.XML.XMPP.Stanza = XC.XML.Element.extend(/** @lends XC.XML.XMPP.Stanza# */{

  xmlns: 'jabber:client',

  to: function (val) {
    return this.attr('to', val);
  },

  from: function (val) {
    return this.attr('from', val);
  },

  type: function (val) {
    return this.attr('type', val);
  },

  id: function (val) {
    return this.attr('id', val);
  }
});

/**
 * @class
 * XMPP IQ (Info Query) stanza.
 *
 * @extends XC.XML.XMPP.Stanza
 * @see <a href="http://xmpp.org/rfcs/rfc3920.html#stanzas">XMPP Core: Stanzas</a>
 */
XC.XML.XMPP.IQ = XC.XML.XMPP.Stanza.extend(/** @lends XC.XML.XMPP.IQ# */{
  name: 'iq'
});

/**
 * @class
 * XMPP PubSub Element
 *
 * @extends XC.XML.Element
 * @see <a href="http://xmpp.org/extensions/xep-0060.html#schemas-pubsub">XEP-0060: Publish Subscribe</a>
 */
XC.XML.XMPP.PubSub = XC.XML.Element.extend(/** @lends XC.XML.XMPP.PubSub# */{
  name: 'pubsub',
  xmlns: 'http://jabber.org/protocol/pubsub'
});

/**
 * @class
 * XMPP Message stanza.
 *
 * @extends XC.XML.XMPP.Stanza
 * @see <a href="http://xmpp.org/rfcs/rfc3920.html#stanzas">XMPP Core: Stanzas</a>
 */
XC.XML.XMPP.Message = XC.XML.XMPP.Stanza.extend(/** @lends XC.XML.XMPP.Message# */{
  name: 'message'
});

/**
 * @class
 * XMPP Presence stanza.
 *
 * @extends XC.XML.XMPP.Stanza
 * @see <a href="http://xmpp.org/rfcs/rfc3920.html#stanzas">XMPP Core: Stanzas</a>
 */
XC.XML.XMPP.Presence = XC.XML.XMPP.Stanza.extend(/** @lends XC.XML.XMPP.Presence# */{
  name: 'presence'
});

/**
 * @class
 * XMPP Query stanza.
 *
 * @extends XC.XML.Element
 * @see <a href="http://xmpp.org/rfcs/rfc3920.html#stanzas">XMPP Core: Stanzas</a>
 */
XC.XML.XMPP.Query = XC.XML.Element.extend(/** @lends XMPP.Query# */{
  name: 'query'
});

/**
 * @class
 * XMPP Error stanza.
 *
 * @extends XC.XML.Element
 * @see <a href="http://xmpp.org/rfcs/rfc3920.html#stanzas">XMPP Core: Stanzas</a>
 */
XC.XML.XMPP.Error = XC.XML.Element.extend(/** @lends XMPP.Error# */{
  name: 'error'
});

/**
 * @class
 * XMPP AdHoc Command element.
 *
 * @extends XC.XML.Element
 * @see <a href="http://xmpp.org/extensions/xep-0050.html">XEP-0050 Ad-Hoc Commands</a>
 */
XC.XML.XMPP.Command = XC.XML.Element.extend(/** @lends XC.XML.XMPP.Command# */{
  name: 'command',
  xmlns: 'http://jabber.org/protocol/commands',

  node: function (val) {
    return this.attr('node', val);
  },

  action: function (val) {
    return this.attr('action', val);
  }
});

/**
 * @class
 * XMPP XDataForm element.
 *
 * @extends XC.XML.Element
 * @see <a href="http://xmpp.org/extensions/xep-0004.html">XEP-0004 Data Forms</a>
 */
XC.XML.XMPP.XDataForm = XC.XML.Element.extend(/** @lends XC.XML.XMPP.XDataForm# */{
  name: 'x',
  xmlns: 'jabber:x:data',

  type: function (val) {
    return this.attr('type', val);
  },

  /**
   * A convenience method for adding fields and values to the
   * XDataForm. Calling this method will add an XDataField and value to
   * this XDataForm.
   *
   * @param {String} name The name of the field, as identified in the 'var' attribute.
   * @param {String} value The text to insert into the 'value' element.
   * @param {String} type XDataField type see XEP: 0004.
   * @returns {XC.XML.XMPP.XDataForm} The receiver.
   */
  addField: function (name, value, type) {
    var f, v;
    f = XC.XML.Element.extend({name: 'field'});
    f.attr('var', name);

    if (value) {
      v = XC.XML.Element.extend({name: 'value', text: value});
      f.addChild(v);
    }

    if (type) {
      f.attr('type', type);
    }

    return this.addChild(f);
  }
});
