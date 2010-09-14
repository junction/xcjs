/**
 * @extends XC.Stanza
 * @extends XC.Mixin.ChatStateNotification.Message
 * @class
 */
XC.Message = XC.Stanza.extend(XC.Mixin.ChatStateNotification.Message, /** @lends XC.Message */{

  type: 'chat',

  init: function($super) {
    $super.apply(this, Array.from(arguments).slice(1));

    if (this.packet) {
      var pkt = this.packet;
      this.mixin({
        body: XC_DOMHelper.getTextContent(pkt.getNode().getElementsByTagName('body')[0]),
        thread: XC_DOMHelper.getTextContent(pkt.getNode().getElementsByTagName('thread')[0]),
        subject: XC_DOMHelper.getTextContent(pkt.getNode().getElementsByTagName('subject')[0])
      });
    }
  }.around(),

  /**
   * @type {String}
   */
  subject: null,

  /**
   * @type {String}
   */
  body: null,

  /**
   * @type {String}
   */
  thread: null,

  /**
   * Reply to a message using this
   * message as a template, switching the
   * to and from attributes.
   *
   * @param {String} body  The message body.
   * @param {String} [id]  The id to associate with the message.
   * @returns {XC.Message} The sent message.
   */
  reply: function (body, id) {
    var msg = this.extend({
      to: this.from,
      body: body,
      id: id
    });

    msg.to.connection.send(msg.toStanzaXML().convertToString());
  },

  /**
   * @private
   */
  xmlStanza: XC.XMPP.Message,

  /**
   * Converts a message into an XML Fragment.
   *
   * @returns {XC.XML.Element} A XML Fragment.
   */
  toStanzaXML: function ($super) {
    var msg = $super.apply(this,Array.from(arguments).slice(1));

    var els = ['body','subject','thread'];
    for (var i=0;i<els.length;i++) {
      if (!this[els[i]]) continue;

      msg.addChild(XC.XML.Element.extend({
        name: els[i],
        text: this[els[i]]
      }));
    }

    return msg;
  }.around()
});
