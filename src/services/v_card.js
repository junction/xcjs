/**
 * @class
 * vCards provide contextual information about a user.
 *
 * @see <a href="http://xmpp.org/extensions/xep-0054.html">XEP-0054: vcard-temp</a>
 * @see <a href="http://tools.ietf.org/html/rfc2426">RFC 2426: vCard MIME</a>
 */
XC.Service.VCard = XC.Base.extend(XC.Mixin.Discoverable,
  /** @lends XC.Service.VCard# */{

  /** @private */
  init: function ($super) {
    if (XC.isFunction($super)) {
      $super.apply(this, Array.from(arguments).slice(1));      
    }

    if (this.connection) {
      this.addFeature(XC.Registrar.VCard.XMLNS);
    }
  }.around(),

  /**
   * Retrieve your vCard.
   * @param {Object} callbacks An Object with methods 'onSuccess' and 'onError'
   *   @param {Function} callbacks.onError Called when an error occurred.
   *     @param {XC.PacketAdapter} callbacks.onError#packet
   *       The packet that caused the error.
   *   @param {Function} callbacks.onSuccess Called on a successful vCard get.
   *     @param {Element} callbacks.onSuccess#vCard
   *       The vCard information as an XML Document fragment.
   */
  get: function (callbacks) {
    var iq = XC.XML.XMPP.IQ.extend(),
        vCard = XC.XML.Element.extend({name: 'vCard',
                                       xmlns: XC.Registrar.VCard.XMLNS});
    iq.type('get');
    iq.addChild(vCard);

    this.connection.send(iq.toString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError &&
          XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else if (callbacks && callbacks.onSuccess &&
          XC.isFunction(callbacks.onSuccess)) {
        callbacks.onSuccess(XC_DOMHelper.getElementsByNS(
                              packet.getNode(),
                              XC.Registrar.VCard.XMLNS)[0]);
      }
    });
  },

  /**
   * Update your vCard.
   * @param {Element} vCard The vCard XML document to send to the server.
   * @param {Object} callbacks An Object with methods 'onSuccess' and 'onError'
   *   @param {Function} callbacks.onError Called when an error occurred.
   *     @param {XC.PacketAdapter} callbacks.onError#packet
   *       The packet that caused the error.
   *   @param {Function} callbacks.onSuccess Called on a successful vCard get.
   */
  set: function (vCard, callbacks) {
    var iq = XC.XML.XMPP.IQ.extend(),
        rawVCard = XC.Base.extend({ toString: function () {
                                      return XC_DOMHelper.serializeToString(vCard);
                                    }
                                  });
    iq.type('set');
    iq.addChild(rawVCard);

    this.connection.send(iq.toString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError &&
          XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else if (callbacks && callbacks.onSuccess &&
          XC.isFunction(callbacks.onSuccess)) {
        callbacks.onSuccess();
      }
    });
  }

});
