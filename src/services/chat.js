/**
 * One-to-one Chatting
 * @class
 * @extends XC.Base
 *
 * RFC 3921: XMPP IM; Section 4
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Service.Chat = XC.Base.extend(/** @lends XC.Service.Chat */{

  /**
   * Send a chat message to another entity.
   *
   * @param {String} jid         The jid to send the chat message to.
   * @param {String} [body]      The body of the message.
   * @param {String} [subject]   The subject of the message.
   * @param {String} [thread]    The thread of the message.
   * @param {Object} [callbacks] An Object that has 'onError'.
   *
   * @returns {XC.Entity} The entity the message was sent to.
   */
  send: function (jid, body, subject, thread, callbacks) {
    var entity = XC.Entity.extend({
      jid: jid,
      connection: this.connection
    });

    entity.sendChat(body, subject, thread, callbacks);
    return entity;
  },

  /**
   * Endpoint to recieve out-of-band messages.
   *
   * @param {XC.Message} message     A message from another entity.
   */
  onMessage: function (message) {},

  /**
   * Handles out-of-band messages (All incoming messages)
   * from another entity.
   *
   * @param {Element} packet        The incoming XML stanza.
   */
  _handleMessages: function (packet) {
    var msg = XC.Message.extend({
      to: XC.Entity.extend({jid: packet.getAttribute('to')}),
      from: XC.Entity.extend({jid: packet.getAttribute('from')})
    }), subject, body, thread;

    if (packet.getType() === 'chat') {
      subject = packet.getElementsByTagName('subject');
      if (subject && subject[0]) {
        msg.subject = subject[0].text;
      }

      body = packet.getElementsByTagName('body');
      if (body && body[0]) {
        msg.body = body[0].text;
      }

      thread = packet.getElementsByTagName('thread');
      if (thread && thread[0]) {
        msg.thread = thread[0].text;
      }

      this.onMessage(msg);
    }
  }
});
