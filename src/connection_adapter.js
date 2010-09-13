/**
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
 * @class
 * @extends XC.Base
 */
XC.ConnectionAdapter = XC.Base.extend(/** @lends XC.ConnectionAdapter# */{
  /** The JID of this connection. */
  jid: function () {},

  /**
   * Send an XML string to the underlying connection.
   *
   * @param {String} xml The XML String to send.
   * @param {Function} callback Called when a response to this packet is received with the first argument being the received packet.
   * @param {Array} args An array of arguments to be passed to callback after the packet.
   *
   * @see XC.Connection#send
   */
  send: function (xml, callback, args) {},

  /**
   * Registers an event handler.
   *
   * @param {String} event The type of stanza for which to listen (i.e., `message', `iq', `presence.')
   * @param {Function} handler The stanza is passed to this function when it is received.
   *
   * @see XC.ConnectionAdapter#unregisterHandler
   * @see XC.Connection#registerJIDHandler
   */
  registerHandler: function (event, handler) {},

  /**
   * Unregisters an event handler.
   *
   * @param {String} event The type of stanza we were listening to (i.e., `message', `iq', `presence.')
   *
   * @see XC.ConnectionAdapter#registerHandler
   * @see XC.Connection#unregisterJIDHandler
   */
  unregisterHandler: function (event) {}
});
