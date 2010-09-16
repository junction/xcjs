/**
 * Strophe Connection Adapter
 * @extends XC.ConnectionAdapter
 */
XC.StropheAdapter = XC.ConnectionAdapter.extend({
  _callbacks: {},
  _handlers: {},

  init: function () {
    this._callbacks = {};
    this._handlers = {};
  },

  jid: function () {
    return this.connection.jid;
  },

  registerHandler: function (event, handler) {
    var that = this;

    var wrapper = function (stanza) {
      var packetAdapter = that.toPacket(stanza),
          newArgs = [packetAdapter];

      for (var i = 1, len = arguments.length; i < len; i++) {
        newArgs.push(arguments[i]);
      }

      try {
        handler.apply(this, newArgs);
      } catch (e) {
        XC.error('Error in XC handler: ' + handler + '; Error: ' + e + '; response stanza: ' + stanza);
      }
      return true;
    };

    this.unregisterHandler(event);
    this._handlers[event] = this.connection.addHandler(wrapper, null, event,
                                                       null, null, null);
  },

  unregisterHandler: function (event) {
    if (this._handlers[event]) {
      this.connection.deleteHandler(this._handlers[event]);
      delete this._handlers[event];
    }
  },

  createNode: function (xml) {
    var node = null, parser = null;
    if (window.ActiveXObject) {
      parser = new ActiveXObject("Microsoft.XMLDOM");
      parser.async = "false";
      parser.setProperty("SelectionLanguage", "XPath");
      parser.loadXML(xml);
      node = parser.firstChild;
    } else {
      parser = new DOMParser();
      node = parser.parseFromString(xml, 'text/xml');
      node = node.firstChild;
      document.adoptNode(node);
    }
    return node;
  },

  send: function (xml, callback, args) {
    var node = this.createNode(xml),
        that = this;

    if (!this.connection.connected || this.connection.disconnecting) {
      XC.log('Prevented "' + xml + '" from being sent because the BOSH connection is being disposed / is disposed.');
      return;
    }

    if (callback) {
      var wrapper = function (stanza) {
        var packetAdapter = that.toPacket(stanza),
            newArgs = [packetAdapter];
        args = args || [];
        for (var i = 0, len = args.length; i < len; i++) {
          newArgs.push(args[i]);
        }

        try {
          callback.apply(this, newArgs);
        } catch (e) {
          XC.error('Error in XC handler: ' + callback + '; Error: ' + e + '; response stanza: ' + stanza);
        }

        delete that._callbacks[node.getAttribute('id')];

        return false;
      };

      var id = node.getAttribute('id');
      if (!id) {
        id = this.connection.getUniqueId();
        node.setAttribute('id', id);
      }

      this._callbacks[id] = this.connection.addHandler(wrapper, null, null,
                                           null, id, null);

    }
    node.setAttribute('xmlns', 'jabber:client');
    return this.connection.send(node);
  },

  toPacket: function (stanza) {
    var to = stanza.getAttribute('to'),
        from = stanza.getAttribute('from'),
        type = stanza.getAttribute('type');
    return {
      getFrom: function () {
        return from;
      },
      getType: function () {
        return type;
      },
      getTo: function () { 
        return to;
      },
      getNode: function () {
        return stanza;
      }
    };
  }
});
