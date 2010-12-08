/**
 * @class
 * XC Connection Adapter abstract object.
 *
 * An instance of this object MUST be supplied to the XC.Connection
 * instance. This object is to be defined by consumers of the API as
 * an adapter to the XMPP connection library that is being used. See
 * the example for using the XC.ConnectionAdapter with the JSJaC XMPP
 * library.
 *
 * @example
 * var conn = new JSJaCConnection();
 * var adapter = XC.ConnectionAdapter.extend({
 *   jid: function() { return conn.jid; },
 *
 *   registerHandler: function (event, handler) {
 *     return conn.registerHandler(event, handler);
 *   },
 *
 *   unregisterHandler: function (event, handler) {
 *     return conn.unregisterHandler(event, handler);
 *   },
 *
 *   send: function (xml, cb, args) {
 *     return conn._sendRaw(xml, cb, args);
 *   }
 * });
 *
 * var tmp = XC.Connection.extend({connection: adapter});
 *
 * @extends XC.Base
 */
XC.ConnectionAdapter = XC.Base.extend(/** @lends XC.ConnectionAdapter# */{

  /**
   * The JID of this connection.
   * @returns {String} The JID provided by your BOSH library.
   */
  jid: function () {
    throw new XC.Error("You MUST override XC.ConnectionAdapter#jid " +
                       "so it returns the JID of the BOSH connection.");
  },

  /**
   * Send an XML string to the underlying connection.
   *
   * @param {String} xml The XML String to send.
   * @param {Function} callback Called when a response to this packet is received with the first argument being the received packet.
   * @param {Array} args An array of arguments to be passed to callback after the packet.
   * @returns {void}
   *
   * @see XC.Connection#send
   */
  send: function (xml, callback, args) {
    throw new XC.Error("You MUST override XC.ConnectionAdapter#send " +
                       "so it will send XML over the BOSH connection.");
  },

  /**
   * Registers an event handler.
   *
   * @param {String} event The type of stanza for which to listen (i.e., `message', `iq', `presence.')
   * @param {Function} handler The stanza is passed to this function when it is received.
   * @returns {void}
   */
  registerHandler: function (event, handler) {
    throw new XC.Error("You MUST override XC.ConnectionAdapter#registerHandler " +
                       "so it will handle events the BOSH connection recieves.");
  },

  /**
   * Unregisters an event handler.
   *
   * @param {String} event The type of stanza we were listening to (i.e., `message', `iq', `presence.')
   * @returns {void}
   */
  unregisterHandler: function (event) {
    throw new XC.Error("You MUST override XC.ConnectionAdapter#unregisterHandler " +
                       "so it will remove event handlers on the BOSH connection.");
  }

});
