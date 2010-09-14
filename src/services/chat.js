/**
 * @class
 * @extends XC.Base
 * @extends XC.Mixin.Discoverable
 * @extends XC.Mixin.HandlerRegistration
 *
 * One-to-one Chatting
 * RFC 3921: XMPP IM; Section 4
 * @see http://ietf.org/rfc/rfc3921.txt
 *
 * @example
 * var xc = XC.Connection.extend(... with connection adapter ...);
 * xc.initConnection();
 * xc.Chat.registerHandler('onMessge', function(xcMessage) {...});
 */
XC.Service.Chat = XC.Base.extend(XC.Mixin.Discoverable, XC.Mixin.HandlerRegistration,
  /** @lends XC.Service.Chat */{
  /**
   * Register for incoming stanzas
   * @private
   */
  init: function ($super) {
    $super.apply(this, Array.from(arguments).slice(1));

    if (this.connection) {
      this.connection.registerStanzaHandler({
        element: 'message',
        type: 'chat'
      }, this._handleMessages, this);
    }

    return this;
  }.around(),

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
   * Handles out-of-band messages (All incoming messages)
   * from another entity.
   *
   * @param {Element} packet        The incoming XML stanza.
   */
  _handleMessages: function (packet) {
    var msg = XC.Message.extend({
      packet: packet
    });

    this.fireHandler('onMessage', msg);
  }
});
