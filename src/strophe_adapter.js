/**
 * Strophe Connection Adapter
 * @class
 * @extends XC.ConnectionAdapter
 */
XC.StropheAdapter = XC.ConnectionAdapter.extend(
  /** @lends XC.StropheAdapter# */{

  /** @private */
  _callbacks: {},
  /** @private */
  _handlers: {},

  /** @private */
  init: function () {
    this._callbacks = {};
    this._handlers = {};
  },

  /**
   * Returns the JID associated with the connection.
   * @type {String}
   */
  jid: function () {
    return this.connection.jid;
  },

  /**
   * Subscribe to stanza via top-level XMPP tag name.
   *
   * @param {String} event The top level XMPP tag name to register for.
   * @param {Function} handler The function handler for the event.
   */
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
        XC.error('Error in XC handler: ' + handler +
                 '; Error: ' + e + '; response stanza: ' + stanza);
      }
      return true;
    };

    this.unregisterHandler(event);
    this._handlers[event] = this.connection.addHandler(wrapper, null, event,
                                                       null, null, null);
  },

  /**
   * Unsubscribe from corresponding event.
   *
   * @param {String} event The event to unsubscribe from.
   */
  unregisterHandler: function (event) {
    if (this._handlers[event]) {
      this.connection.deleteHandler(this._handlers[event]);
      delete this._handlers[event];
    }
  },

  /**
   * Create a DOM node via XML.
   *
   * @private
   * @param {String} xml The xml string to convert into an object.
   * @returns {Element} The document fragment that represents the xml string.
   */
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

  /**
   * Send the xml fragment over the connection.
   *
   * @param {String} xml The xml to send.
   * @param {Function} callback The function to call when done.
   * @param {Array} args A list of arguments to provide to the callback.
   */
  send: function (xml, callback, args) {
    var node = this.createNode(xml),
        that = this;

    if (!this.connection.connected || this.connection.disconnecting) {
      XC.log('Prevented "' + xml + '" from being sent because ' +
             'the BOSH connection is being disposed / is disposed.');
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
          XC.error('Error in XC handler: ' + callback +
                   '; Error: ' + e + '; response stanza: ' + stanza);
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

  /**
   * Convert a stanza into an object that implements {@link XC.PacketAdapter}.
   *
   * @private
   * @param {Element} stanza The XMPP stanza to pack.
   *
   * @returns {XC.PacketAdapter} The stanza wrapped as a packet.
   */
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
