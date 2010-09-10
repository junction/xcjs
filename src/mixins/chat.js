/**
 * One-to-one Chatting
 * @class
 * @extends XC.Base
 *
 * RFC 3921: XMPP IM; Section 4
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Mixin.Chat = XC.Base.extend(/** @lends XC.Mixin.Chat */{

  /**
   * Send a chat message to another entity.
   *
   * @param {String} [body]      The body of the message.
   * @param {String} [subject]   The subject of the message.
   * @param {String} [thread]    The thread of the message.
   * @param {String} [id]        The id of the message.
   *
   * @returns {XC.Entity} The entity the message was sent to.
   */
  sendChat: function (body, subject, thread, id) {
    var msg = XC.Message.extend({
      type: 'chat',
      body: body,
      subject: subject,
      thread: thread,
      to: this,
      id: id
    });

    this.connection.send(msg.toXML().convertToString());
    return this;
  }

});
