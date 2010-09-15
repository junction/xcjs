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
 * xc.Chat.registerHandler('onMessage', function(xcMessage) {...});
 */
XC.Service.Chat = XC.Base.extend(XC.Mixin.Discoverable,
                                 XC.Mixin.HandlerRegistration,
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
   * Handles out-of-band messages (All incoming messages)
   * from another entity.
   *
   * @param {Element} packet        The incoming XML stanza.
   */
  _handleMessages: function (packet) {
    var msg = this.connection.Message.extend({
      packet: packet
    });

    this.fireHandler('onMessage', msg);
  }
});
