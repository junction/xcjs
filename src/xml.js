/**
 * Namespace for XML elements
 * @namespace
 */
XC.XML = {};

/**
 * A simple XML element class.
 *
 * @example
 * var newElement = XC.XML.Element.extend({name: 'foo'})
 * newElement.attr('bar', 'bam');
 * newElement.addChild(XC.XML.Element.extend({name: 'child'});
 *
 * @extends XC.Base
 * @class
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
   * Return an XML string representation of this element.
   *
   * @returns {String} This XML element as XML text.
   */
  convertToString: function () {
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

        attrs.push(name + '="' + val + '"');
      }
    }

    ret += "<" + this.name;
    ret += (attrs.length > 0) ? ' ' + attrs.join(' ') : '';
    ret += ">";

    var children = this.children || [];
    for (var i = 0, len = children.length; i < len; i++) {
      ret += this.children[i].convertToString();
    }

    if (this.text) {
      ret += this.text;
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
  }
});

/**
 * Namespace for XMPP XML elements.
 * @namespace
 */
XC.XML.XMPP = {};

/**
 * Generic XMPP stanza.
 *
 * @extends XC.XML.Element
 * @class
 */
XC.XML.XMPP.Stanza = XC.XML.Element.extend(/** @lends XC.XML.XMPP.Stanza# */{
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
 * XMPP IQ stanza.
 *
 * @extends XC.XML.XMPP.Stanza
 * @class
 */
XC.XML.XMPP.IQ = XC.XML.XMPP.Stanza.extend(/** @lends XC.XML.XMPP.IQ# */{
  name: 'iq'
});

/**
 * XMPP PubSub Element
 *
 * @extends XC.XML.Element
 * @class
 */
XC.XML.XMPP.PubSub = XC.XML.Element.extend(/** @lends XC.XML.XMPP.PubSub# */{
  name: 'pubsub',
  xmlns: 'http://jabber.org/protocol/pubsub'
});

/**
 * XMPP Message stanza.
 *
 * @extends XC.XML.XMPP.Stanza
 * @class
 */
XC.XML.XMPP.Message = XC.XML.XMPP.Stanza.extend(/** @lends XC.XML.XMPP.Message# */{
  name: 'message'
});

/**
 * XMPP Presence stanza.
 *
 * @extends XC.XML.XMPP.Stanza
 * @class
 */
XC.XML.XMPP.Presence = XC.XML.XMPP.Stanza.extend(/** @lends XC.XML.XMPP.Presence# */{
  name: 'presence'
});

/**
 * XMPP Query stanza.
 *
 * @extends XC.XML.XMPP.Stanza
 * @class
 */
XC.XML.XMPP.Query = XC.XML.Element.extend(/** @lends XMPP.Query# */{
  name: 'query'
});

/**
 * XMPP Error stanza.
 *
 * @extends XC.XML.XMPP.Stanza
 * @class
 */
XC.XML.XMPP.Error = XC.XML.Element.extend(/** @lends XMPP.Error# */{
  name: 'error'
});

/**
 * XMPP AdHoc Command element.
 *
 * @extends XC.XML.Element
 * @class
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
 * XMPP XDataForm element.
 *
 * @extends XC.XML.Element
 * @class
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
