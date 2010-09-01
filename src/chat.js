/**
 * One-to-one Chatting
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 4
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Chat = {

  type: 'chat',

  /**
   * Send a message to another entity.
   * 
   * @param {XC.Message} message     The message to send to another entity.
   * @param {Object}     [callbacks] An Object that has 'onSuccess' and 'onError'.
   */
  send: function (message, callbacks) {},

  /**
   * Endpoint to recieve out-of-band messages.
   * 
   * @param {XC.Message} message     A message from another entity.
   */
  onMessage: function (message) {}
};
