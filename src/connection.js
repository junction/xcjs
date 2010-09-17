/**
 * Connection object to use for all XC connections. The +initConnection+
 * {@link XC.Connection#initConnection} method MUST be called after
 * extending this object.
 *
 * @class
 * @extends XC.Base
 * @property {XC.Service.Presence} Presence#
 * @property {XC.Service.Roster} Roster#
 * @property {XC.Service.Chat} Chat#
 * @property {XC.Service.Disco} Disco#
 */
XC.Connection = XC.Base.extend(/** @lends XC.Connection# */{

  /**
   * Map of instance names to instance objects. Used during
   * initConnection().
   *
   * @see XC.Connection#initConnection
   * @private
   */
  services: {
    Presence: XC.Service.Presence,
    Roster:   XC.Service.Roster,
    Chat:     XC.Service.Chat,
    Disco:    XC.Service.Disco
  },

  /**
   * Templates are extended with the connection (this) during initConnection()
   * @private
   */
  templates: {
    Entity: XC.Entity,
    Message: XC.Message
  },

  /**
   * @private
   */
  init: function ($super) {
    if (this.connectionAdapter) {
      if (!this.getJID() || this.getJID() === '') {
        throw new XC.Error('Missing JID');
      }
      this._stanzaHandlers = this._stanzaHandlersTemplate.extend();

      for (var s in this.services) {
        if (this.services.hasOwnProperty(s)) {
          var service = this.services[s];
          this[s] = service.extend({connection: this});
        }
      }

      for (var t in this.templates) {
        if (this.templates.hasOwnProperty(t)) {
          this[t] = this.templates[t].extend({connection: this});
        }
      }

      // Register for all incoming stanza types.
      var that = this,
          events = ['iq', 'message', 'presence'],
          dispatch = function (stanza) {
            if (that.DEBUG_PACKETS) {
              that._validatePacket(stanza);
            }
            that._dispatchStanza(stanza);
            return true;
          };
      for (var i = 0; i < events.length; i++) {
        this.connectionAdapter.registerHandler(events[i], dispatch);
      }
    }

    if (XC.isFunction($super)) {
      $super.apply(this, Array.from(arguments).slice(1));
    }
  }.around(),

  /**
   * Sends an XML string to the connection adapter.
   *
   * @param {String} xml The XML String to send.
   * @param {Function} callback Called when a response to this packet is received with the first argument being the received packet.
   * @param {Array} [args] An array of arguments to be passed to callback after the packet.
   *
   * @see XC.ConnectionAdapter#send
   */
  send: function (xml, callback, args) {
    this.connectionAdapter.send(xml, callback, args || []);
  },

  /**
   * Returns the JID of this connection.
   *
   * @example
   * xc.getJID();
   *
   * @returns {String} This connection's JID.
   *
   * @see XC.ConnectionAdapter#jid
   */
  getJID: function () {
    return this.connectionAdapter.jid();
  },

  /**
   * Register a handler for a stanza based on the following criteria:
   *
   * element - stanza element; 'iq', 'message', or 'presence'
   * xmlns   - namespace of the stanza element OR first child
   * from    - from JID
   * type    - stanza type
   * id      - stanza id
   *
   * This function is only to be called internally by the XC.Services.
   * Client libraries should register their callbacks with each service,
   * or directly with their bosh connection for services not provided
   * by the XC library.
   *
   * @private
   * @param {Object} criteria has any of the members listed above
   * @param {Function} callback
   * @param {Object} [target] scope for 'this'
   * @returns {Mixed} id indicates success or false indicates failure
   */
  registerStanzaHandler: function (criteria, callback, target) {
    if (!XC.isFunction(callback)) {
      return false;
    }

    target = target || window || this;
    return this._stanzaHandlers.insert(criteria, function () {
      callback.apply(target, arguments);
    });
  },

  /**
   * @private
   */
  unregisterStanzaHandler: function (id) {
    return this._stanzaHandlers.remove(id);
  },

  /**
   * @private
   */
  DEBUG_PACKETS: false,

  /**
   * @private
   */
  _validatePacket: function (p) {
    var pktInterface = {
      getNode: function () {
        return p.getNode && p.getNode().nodeType;
      },
      getType: function () {
        return p.getType && XC.isString(p.getType());
      },
      getFrom: function () {
        return p.getFrom && XC.isString(p.getFrom());
      },
      getTo: function () {
        return p.getTo && XC.isString(p.getTo());
      }
    };
    for (var test in pktInterface) {
      if (pktInterface.hasOwnProperty(test)) {
        if (!pktInterface[test]()) {
          throw new XC.Error('Packet failed to validate ' + test);
        }
      }
    }
  },

  /**
   * Find a set of registered callbacks whose set of criteria match the stanza
   * and call the callbacks with the stanza.
   *
   * @private
   */
  _dispatchStanza: function (stanza) {
    var callbacks = this._stanzaHandlers.findCallbacks(stanza);
    for (var i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i](stanza);
    }
  },

  /**
   * Stanza Handlers are registered by the Services to register a callback
   * for a specific stanza based on various criteria
   *
   * @private
   * @see XC.Connection#registerStanzaHandler
   * @see XC.Connection#unregisterStanzaHandler
   */
  _stanzaHandlersTemplate: XC.Base.extend({
    lastID: 0,
    store: {},

    insert: function (criteria, cb) {
      var id = this.lastID++;
      this.store[id] = {
        criteria: criteria,
        callback: cb
      };

      return id;
    },

    remove: function (id) {
      if (this.store[id]) {
        delete this.store[id];
        return true;
      }
      return false;
    },

    findCallbacks: function (stanza) {
      var resultSet = [];

      for (var id in this.store) {
        if (this.store.hasOwnProperty(id)) {
          var callbackSet = this.store[id],
              criteria = callbackSet.criteria,
              cb = callbackSet.callback,
              domEl = stanza.getNode(),
              firstChild = XC_DOMHelper.getFirstElementChild(domEl);

          if (!cb || !criteria) {
            continue;
          }

          if (criteria.element && domEl.tagName !== criteria.element) {
            continue;
          }

          if (criteria.xmlns &&
              !(domEl.getAttribute('xmlns') === criteria.xmlns ||
              (firstChild && firstChild.getAttribute('xmlns') === criteria.xmlns))) {
            continue;
          }

          if (criteria.from && stanza.getFrom() !== criteria.from) {
            continue;
          }

          if (criteria.type && stanza.getType() !== criteria.type) {
            continue;
          }

          if (criteria.id && domEl.getAttribute('id') !== criteria.id) {
            continue;
          }

          // we've passed all of our criteria tests
          resultSet.push(cb);
        }
      }
      return resultSet;
    }
  })
});
