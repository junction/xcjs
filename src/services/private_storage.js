/**
 * @class
 * Private Storage
 *
 * Provides an API to read and write XML to / from private XML storage.
 * Note that this implementation is based off of the historical XEP,
 * and should <b>NOT</b> be used if your XMPP server supports PubSub.
 *
 * If your server supports PubSub, use <a href="http://xmpp.org/extensions/xep-0223.html">
 * XEP-0223: Persistent Storage of Private Data via PubSub</a>, which
 * is the recommended way of synchronizing private data.
 *
 * @extends XC.Base
 * @see <a href="http://xmpp.org/extensions/xep-0049.html">XEP-0049: Private XML Storage</a>
 */
XC.Service.PrivateStorage = XC.Base.extend(/** @lends XC.Service.PrivateStorage# */{

  /**
   * Retrieve the private storage in the given
   * tagname and namespace.
   *
   * @param {Object} callbacks An Object with methods 'onSuccess' and 'onError'
   *   @param {Function} callbacks.onError Called when an error occurred.
   *     @param {XC.PacketAdapter} callbacks.onError#packet
   *       The packet that caused the error.
   *   @param {Function} callbacks.onSuccess Called on a successful storage set.
   *     @param {Element} callbacks.onSuccess#xml
   *       The private storage element as an XML Document fragment.
   * @returns {void}
   * @example
   *   xc.PrivateStorage.get('recipes', 'chef:cookbook', {
   *     success: function (xml) {
   *       // process XML document fragment here...
   *     }
   *   });
   */
  get: function (tag, namespace, callbacks) {
    var xml = XC.XML.Element.xmlize({
      attrs: { type: 'get' },
      children: [{
        name: 'query',
        xmlns: XC.Registrar.PrivateStorage.XMLNS,
        children: [{
          name: tag,
          xmlns: namespace
        }]
      }]
    }, XC.XML.XMPP.IQ.extend());

    this.connection.send(xml.toString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError &&
          XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else if (callbacks && callbacks.onSuccess &&
          XC.isFunction(callbacks.onSuccess)) {
        var query = XC_DOMHelper.getElementsByNS(
                      packet.getNode(),
                      XC.Registrar.PrivateStorage.XMLNS)[0];
        callbacks.onSuccess(XC_DOMHelper.getElementsByNS(query, namespace)[0]);
      }
    });
  },

  /**
   * Set the private storage in the given tagname and namespace.
   *
   * Keep in mind that private storage does not provide any
   * capabilities for editing parts of an item. This means
   * that whatever you set the element to will override existing
   * data.
   *
   * @param {String} tag The tag name of the element to set.
   * @param {String} xmlns The namespace of the element to set.
   * @param {Object} content The content to set the element to in
   *   the format as described in {@link XC.Element.xmlize}.
   * @param {Object} callbacks An Object with methods 'onSuccess' and 'onError'
   *   @param {Function} callbacks.onError Called when an error occurred.
   *     @param {XC.PacketAdapter} callbacks.onError#packet
   *       The packet that caused the error.
   *   @param {Function} callbacks.onSuccess Called on a successful storage set.
   * @returns {void}
   * @example
   *   xc.PrivateStorage.set('recipes', 'chef:cookbook', [{
   *     name: 'recipe',
   *     children: [{
   *       name: 'title',
   *       text: 'Chocolate Moose'
   *     }, {
   *       name: 'author',
   *       text: 'Swedish Chef'
   *     }, {
   *       name: 'instructions',
   *       children: [{
   *         name: 'step',
   *         attrs: { 'no': 1 },
   *         text: 'Get chocolate.'
   *       }, {
   *         name: 'step',
   *         attrs: { 'no': 2 },
   *         text: 'Get a moose.'
   *       }, {
   *         name: 'step',
   *         attrs: { 'no': 3 },
   *         text: 'Put the chocolate on the moose.'
   *       }]
   *     }]
   *   }]);
   *
   *   // This will send the following XML to be stored:
   *   // => <recipes xmlns="chef:cookbook">
   *   //      <recipe>
   *   //        <title>Chocolate Moose</title>
   *   //        <author>Swedish Chef</author>
   *   //        <instructions>
   *   //          <step no="1">Get chocolate.</step>
   *   //          <step no="2">Get a moose.</step>
   *   //          <step no="3">Put the chocolate on the moose.</step>
   *   //        </instructions>
   *   //      </recipe>
   *   //    </recipes>
   */
  set: function (tag, namespace, content, callbacks) {
    var xml = XC.XML.Element.xmlize({
      attrs: { type: 'set' },
      children: [{
        name: 'query',
        xmlns: 'jabber:iq:private',
        children: [{
          name: tag,
          xmlns: namespace,
          children: content
        }]
      }]
    }, XC.XML.XMPP.IQ.extend());

    this.connection.send(xml.toString(), function (packet) {
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
