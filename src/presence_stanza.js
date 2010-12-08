/**
 * @namespace
 * Generic Presence stanza creation and parsing.
 * @extends XC.Stanza
 */
XC.PresenceStanza = XC.Stanza.extend(XC.Mixin.DelayedDelivery, /** @lends XC.PresenceStanza# */{

  /**
   * The &lt;show&gt; XML fragment of the packet.
   * @type XC.Registrar.Presence.SHOW
   */
  show: null,

  /**
   * The &lt;status&gt; XML fragment of the packet.
   * @type String
   */
  status: null,

  /**
   * The &lt;priority&gt; XML fragment of the packet,
   * between -128 and +127.
   * @type Number
   */
  priority: null,

  /**
   * Unpack a message from a packet, or just do an ordinary init.
   *
   * @param {Function} $super The XC.Stanza toStanzaXML function
   * @private
   */
  init: function ($super) {
    $super.apply(this, Array.from(arguments).slice(1));

    if (this.packet) {
      var node = this.packet.getNode();
      this.mixin({
        show: XC_DOMHelper.getTextContent(
                node.getElementsByTagName('show')[0]
              ),
        status: XC_DOMHelper.getTextContent(
                  node.getElementsByTagName('status')[0]
                ),
        priority: parseInt(XC_DOMHelper.getTextContent(
                   node.getElementsByTagName('priority')[0]
                  ), 10)
      });
    }
  }.around(),

  /**
   * Accept a subscription request.
   * @returns {void}
   */
  accept: function () {
    var p = XC.PresenceStanza.extend();

    switch (this.type) {
    case 'subscribe':
      p.type = 'subscribed';
      break;
    case 'subscribed':
      p.type = 'subscribe';
      break;
    case 'unsubscribe':
      p.type = 'unsubscribed';
      break;
    case 'unsubscribed':
      p.type = 'unsubscribe';
      break;
    default:
      return;
    }

    p.to = this.from;
    p.to.connection.send(p.toStanzaXML().convertToString());
  },

  /**
   * Deny a subscription request.
   * @returns {void}
   */
  deny: function () {
    var p = XC.PresenceStanza.extend();

    switch (this.type) {
    case 'subscribe':
      p.type = 'unsubscribed';
      break;
    case 'subscribed':
      p.type = 'unsubscribe';
      break;
    case 'unsubscribe':
      p.type = 'subscribed';
      break;
    case 'unsubscribed':
      p.type = 'subscribe';
      break;
    default:
      return;
    }

    p.to = this.from;
    p.to.connection.send(p.toStanzaXML().convertToString());
  },

  /**
   * @private
   * The builder for XC.Stanza's base toStanzaXML
   */
  xmlStanza: XC.XML.XMPP.Presence,

  /**
   * Converts presence into an XML Fragment.
   *
   * @param {Function} $super The XC.Stanza toStanzaXML function
   * @returns {XC.XML.Element} A XML Fragment.
   */
  toStanzaXML: function ($super) {
    var msg = $super.apply(this, Array.from(arguments).slice(1));

    var els = ['status', 'priority'];

    if (this.show && this.show !== XC.Registrar.Presence.SHOW.AVAILABLE) {
      msg.addChild(XC.XML.Element.extend({
        name: 'show',
        text: this.show
      }));
    }

    if (this.status) {
      msg.addChild(XC.XML.Element.extend({
        name: 'status',
        text: this.status
      }));
    }

    if (this.priority &&
        this.priority > -128 && this.priority <= 127) {
      msg.addChild(XC.XML.Element.extend({
        name: 'priority',
        text: this.priority
      }));
    }

    return msg;
  }.around()
});
