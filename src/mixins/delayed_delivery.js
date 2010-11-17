/**
 * @class
 * Delayed Delivery provides timestamp information about data stored for later delivery.
 * The most common uses of delayed delivery are:
 * <ul>
 *   <li>A message that is sent to an offline entity for later delivery.</li>
 *   <li>The last available presence stanza sent by a connected client to a server.</li>
 *   <li>Messages cached by a Multi-User Chat room for delivery to new participants when they join the room.</li>
 * </ul>
 * @extends XC.Base
 *
 * @see <a href="http://xmpp.org/extensions/xep-0203.html">XEP-0203: Delayed Delivery</a>
 */
XC.Mixin.DelayedDelivery = /** @lends XC.Mixin.DelayedDelivery# */{

  /**
   * @namespace
   * Slots for delay elements.
   */
  delay: {

    /**
     * The 'from' attribute of the delay node.
     * @type {String}
     */
    from: null,

    /**
     * The 'stamp' attribute of the delay node, as a UTC string.
     * @type {String}
     */
    stamp: null,

    /**
     * The text message sent as the body of the delay node,
     * providing infomation on why the mesage was delayed.
     * @type {String}
     */
    text: null
  },

  /**
   * Look for the delay element and the delay namespace,
   * pulling out the 'from' and 'stamp' attibutes and
   * info body.
   */
  init: function ($super) {
    $super.apply(this, Array.from(arguments).slice(1));

    if (this.packet) {
      var pkt = this.packet, delayNode;

      delayNode = XC_DOMHelper.getElementsByNS(pkt.getNode(),
                    XC.Registrar.DelayedDelivery.XMLNS);
      delayNode = delayNode[0];

      if (delayNode) {
        this.delay = {
          from: delayNode.getAttribute('from'),
          stamp: delayNode.getAttribute('stamp'),
          text: XC_DOMHelper.getTextContent(delayNode) || ''
        };
      }
    }
  }.around()

};
