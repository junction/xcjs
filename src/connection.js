/**
 * Connection object to use for all XC connections. The +initConnection+
 * {@link XC.Connection#initConnection} method MUST be called after
 * extending this object.
 *
 * @class
 * @extends XC.Object
 * @property {XC.Service.Presence} Presence#
 * @property {XC.Service.Roster} Roster#
 * @property {XC.Service.Chat} Chat#
 * @property {XC.Service.Disco} Disco#
 */
XC.Connection = XC.Object.extend(/** @lends XC.Connection# */{
  /**
   * Map of instance names to instance objects. Used during
   * initConnection().
   *
   * @see XC.Connection#initConnection
   */
  services: {
    Presence:   XC.Service.Presence,
    Roster:     XC.Service.Roster,
    Chat:       XC.Service.Chat,
    Disco:      XC.Service.Disco
  },

  /**
   * Map of jids to event handler functions. Used when message events
   * are received from the connection.
   *
   * @see XC.Connection#registerJIDHandler
   * @see XC.Connection#unregisterJIDHandler
   */
  jidHandlers: {},

  /**
   * Initialize the service properties.
   *
   * @example
   * var xc = XC.Connection.extend();
   * xc.initConnection();
   *
   * @return {XC.Connection}
   */
  initConnection: function () {
    if (!this.getJID() || this.getJID() === '') {
      throw new XC.Error('Missing JID');
    }
    var serviceMap = {};

    for (var s in this.services) {
      if (this.services.hasOwnProperty(s)) {
        var service = this.services[s];

        this[s] = service.extend({connection: this});
      }
    }

    // Register for incoming messages.
    var that = this;
    this.connection.registerHandler('message', function (msg) {
      var from = msg.getFrom();
      var fn = that.jidHandlers[from];
      if (fn) {
        fn(msg);
      }
    });

    return this;
  },

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
    this.connection.send(xml, callback, args || []);
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
    return this.connection.jid();
  }

});
