/*globals YAHOO */
/* Namespace for XC tests. */
XC.Test = {};
XC.Test.Mixin = {};
XC.Test.Service = {};

XC.Test.MockConnection = XC.ConnectionAdapter.extend({
  _handlers: null,
  _data: null,
  _responses: null,

  jid: function () {
    return 'mock@example.com';
  },

  init: function () {
    this._responses = [];
    this._handlers  = {};

    return this;
  },

  addResponse: function (response) {
    this._responses.push(response);
  },

  nextResponse: function () {
    return this._responses.shift();
  },

  fireEvent: function (event) {
    var handler = this._handlers[event],
        args    = [];

    for (var i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    if (handler) {
      handler.apply(handler, args);
    }
  },

  send: function (xml, callback, args) {
    this._data = xml;
    args = args || [];
    args.unshift(this.nextResponse());
    if (callback) {
      callback.apply(callback, args);
    }
  },

  registerHandler: function (event, handler) {
    this._handlers[event] = handler;
  },

  unregisterHandler: function (event, handler) {
    delete this._handlers[event];
  },

  getLastStanzaXML: function() {
    return this._data;
  }
});

XC.Test.DOMParser = XC.Base.extend({
  parser: function () {
    var parser;
    try {
      // Internet Explorer does not use the DOMParser
      parser = new ActiveXObject("Microsoft.XMLDOM");
      parser.async = "false";
      parser.setProperty("SelectionLanguage", "XPath");
      var namespaces = "";
      for (var key in this.prefixMap) {
        if (this.prefixMap.hasOwnProperty(key)) {
          namespaces += "xmlns:" + key + "='" + this.prefixMap[key] + "' ";
        }
      }

      parser.setProperty("SelectionNamespaces", namespaces.slice(0, -1));
    } catch (e) {
      // Using FF or Safari
      parser = new DOMParser();
    }
    return parser;
  },

  prefixMap: {
    roster: 'jabber:iq:roster',
    client: 'jabber:client',
    err: 'urn:ietf:params:xml:ns:xmpp-stanzas',
    cmd: 'http://jabber.org/protocol/commands',
    x:   'jabber:x:data',
    ps:  'http://jabber.org/protocol/pubsub',
    discoItems: 'http://jabber.org/protocol/disco#items',
    discoInfo: 'http://jabber.org/protocol/disco#info',
    chatStates: 'http://jabber.org/protocol/chatstates',
    vcard: 'vcard-temp',
    fi: 'fi'
  },

  nsResolver: function (ns) {
    return XC.Test.DOMParser.prefixMap[ns];
  },

  parse: function (xml) {
    var doc,
        parser = XC.Test.DOMParser.parser();
    try {
      // IE
      parser.loadXML(xml);
      doc = parser;
    } catch (e) {
      // Firefox and Safari
      doc = parser.parseFromString(xml, 'text/xml');
    }

    return XC.Base.extend({
      doc: doc,

      getPath: function (path) {
        var result;
        try {
          // Using Internet Explorer
          result = parser.selectSingleNode(path);
        } catch (e) {
          // Using FF or Safari
          result = this.doc.evaluate(path, this.doc, XC.Test.DOMParser.nsResolver,
                                     XPathResult.ANY_TYPE, null).iterateNext();
        }
        return result;
      },

      getPathValue: function (path) {
        var rc = this.getPath(path);
        if (rc) {
          if (window.ActiveXObject) {
            // Internet Explorer
            return rc.nodeValue;
          } else {
            // FF or Safari
            if (rc.data) {
              return rc.data;
            } else if (rc.value) {
              return rc.value;
            } else {
              return rc;
            }
          }
        } else {
          return undefined;
        }
      }
    });
  }
});

XC.Test.Packet = XC.Base.extend({
  from:    null,
  to:      null,
  type:    null,
  doc:     null,
  parser:  null,

  extendWithXML: function (xml) {
    var parser_obj = XC.Test.DOMParser.parse(xml);

    var from = parser_obj.getPathValue('//@from'),
        to   = parser_obj.getPathValue('//@to'),
        type = parser_obj.getPathValue('//@type');

    return XC.Test.Packet.extend({from: from, to: to, type: type, doc: parser_obj.doc});
  },

  getFrom: function () {
    return this.from;
  },

  getTo: function () {
    return this.to;
  },

  getType: function () {
    return this.type;
  },

  getNode: function () {
    return this.doc.firstChild;
  }
});

XC.Test.MessageStanza = XC.Test.Packet.extend({
  pType: 'message'
});

XC.Test.IQ = XC.Test.Packet.extend({
  pType: 'iq'
});

YAHOO.util.Assert.isXMPPMessage = function (xml, toJID, type, addlFields) {
  YAHOO.util.Assert.XPathTests(xml, {
    checkType: {
      xpath: '//@type',
      value: type,
      message: 'The message type doesn\'t match.'
    },
    checkJID: {
      xpath: '//@to',
      value: toJID,
      message: 'The message \'to\' attribute is the wrong JID.'
    }
  });

  YAHOO.util.Assert.XPathTests(xml, addlFields);
};

YAHOO.util.Assert.XPathTests = function (xml, additionalFields) {
  var doc = XC.Test.DOMParser.parse(xml);

  if (additionalFields) {
    var xpath, key, val, message, field;
    for (key in additionalFields) {
      if (additionalFields.hasOwnProperty(key)) {
        field = additionalFields[key];
        xpath = field.xpath;
        val = field.value;
        if (field.message) {
          message = field.message;
        } else {
          message = key + ' is incorrect.';
        }

        if (field.assert) {
          field.assert(val, doc.getPathValue(xpath), message);
        } else {
          this.areSame(val, doc.getPathValue(xpath), message);
        }
      }
    }
  }
};

YAHOO.util.Assert.mixesIn = function (object, mixin /* ... */) {
  var mixins = Array.from(arguments).slice(1),
      idx = mixins.length, key;

  while (idx--) {
    for (key in mixins[idx]) {
      if (mixins[idx].hasOwnProperty(key)) {
        YAHOO.util.Assert.areNotSame(object[key], undefined,
                                     "The slot '" + key + "' was not defined.");
      }
    }
  }
};

YAHOO.util.Assert.throws = function (errorClass, cb) {
  try {
    cb();
  } catch (e) {
    this.isInstanceOf(errorClass, e, "Error raised was different from error expected");
    return;
  }
  this.fail("Function failed to raise an error");
};
