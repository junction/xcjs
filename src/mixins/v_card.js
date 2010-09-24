/**
 * @namespace
 * Namespace for vCard Mixins.
 * @see XC.Mixin.VCard.Entity
 */
XC.Mixin.VCard = {};

/**
 * @class
 * vCards provide contextual information about a user.
 *
 * @see <a href="http://xmpp.org/extensions/xep-0054.html">XEP-0054: vcard-temp</a>
 * @see <a href="http://tools.ietf.org/html/rfc2426">RFC 2426: vCard MIME</a>
 */
XC.Mixin.VCard.Entity = /** @lends XC.Mixin.VCard.Entity# */{

  /**
   * The XML formatted vCard.
   * It's left in a raw format because of
   * loose interpretations of the format.
   * @type Element
   */
  vCard: null,
  
  /**
   * Retrieve a user's vCard.
   * @param {Object} callbacks An Object with methods 'onSuccess' and 'onError'
   *   @param {Function} callbacks.onError Called when an error occurred.
   *     @param {XC.PacketAdapter} callbacks.onError#packet
   *       The packet that caused the error.
   *   @param {Function} callbacks.onSuccess Called on a successful vCard get.
   *     @param {XC.Entity} callbacks.onSuccess#entity
   *       The entity that vCard information was requested for.
   */
  getVCard: function (callbacks) {
    var iq = XC.XML.XMPP.IQ.extend(),
        vCard = XC.XML.Element.extend({name: 'vCard',
                                       xmlns: XC.Registrar.VCard.XMLNS}),
        entity = this;
    iq.to(this.getBareJID());
    iq.type('get');
    iq.addChild(vCard);

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError &&
          XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else {
        entity.vCard = XC_DOMHelper.getElementsByNS(packet.getNode(),
                                                    XC.Registrar.VCard.XMLNS)[0];

        if (callbacks && callbacks.onSuccess &&
            XC.isFunction(callbacks.onSuccess)) {
          callbacks.onSuccess(entity);
        }
      }
    });
  }

};
