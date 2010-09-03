/**
 * Service Discovery provides the ability to discover information about entities.
 * @namespace
 * 
 * XEP-0030: Service Discovery
 * @see http://xmpp.org/extensions/xep-0030.html
 * 
 * @requires rootItem  A list of features and items associated with your entity.
 */
XC.Mixin.Disco = {

  XMLNS: 'http://jabber.org/protocol/disco',

  /**
   * Check for features.
   * 
   * @param {String} xmls The namespace of the feature.
   * @param {String} node The node to check for the feature in.
   * 
   * @returns {Boolean} True if the feature exists.
   */
  hasFeature: function (xmlns, node) {
    var features = node ? this.disco.items[node].features : this.disco.features,
        idx = features.length;
    while (idx--) {
      if (features[idx] === xmlns) {
        return true;
      }
    }
    return false;
  },


  /**
   * Discover information about an entity.
   * 
   * @param {Object}    [callbacks]
   */
  discoInfo: function (callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Mixin.Disco.XMLNS + '#info'}),
        entity = this;

    iq.type('get');
    iq.to(entity.jid);

    if (entity.disco && entity.disco.name) {
      q.attr('node', entity.disco.name);
    }

    iq.addChild(q);

    entity.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        packet = packet.getNode();
        var identities = packet.getElementsByTagName('identity'),
            features = packet.getElementsByTagName('feature'),
            iFeat = features ? features.length : 0,
            iIdent = identities ? identities.length : 0,
            identity;

        if (!entity.disco) {
          entity.disco = XC.DiscoItem.extend();
        }

        entity.disco.features = [];
        while (iFeat--) {
          entity.disco.features.push(features[iFeat].getAttribute('var'));
        }

        entity.disco.identities = [];
        while (iIdent--) {
          identity = identities[iIdent];
          entity.disco.identities.push({
            category: identity.getAttribute('category'),
            type: identity.getAttribute('type'),
            name: identity.getAttribute('name')
          });
        }

        callbacks.onSuccess(entity);
      }
    });
  },

  /**
   * Discover the items on an entity.
   * 
   * @param {Object}    [callbacks]
   */
  discoItems: function (callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Mixin.Disco.XMLNS + '#items'}),
        entity = this;

    iq.type('get');
    iq.to(entity.jid);
    iq.addChild(q);

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        packet = packet.getNode();
        var items = packet.getElementsByTagName('item'),
            item, idx = items ? items.length : 0;

        if (!entity.disco) {
          entity.disco = XC.DiscoItem.extend();
        }

        entity.disco.items = [];
        while (idx--) {
          entity.disco.items.push(XC.DiscoItem.extend({
            jid: items[idx].getAttribute('jid'),
            node: items[idx].getAttribute('node'),
            name: items[idx].getAttribute('name')
          }));
        }

        callbacks.onSuccess(entity);
      }
    });
  },

  /**
   * The root item of the Disco Item tree.
   * @type {XC.DiscoItem}
   */
  disco: null
};

/**
 * Represents an item (node) in Service Discovery.
 * 
 * @extends XC.Object
 * @class
 * @see XC.Disco
 */
XC.DiscoItem = XC.Object.extend(/** @lends XC.DiscoItem */{

  /**
   * The JID of the node
   * @type {String}
   */
  jid: null,

  /**
   * The name of the node.
   * @type {String}
   */
  name: null,

  /**
   * Namespaces of supported features.
   * @type {Array{String}}
   */
  features: [],

  /**
   * Array of all items in this item.
   * @type {Array{XC.DiscoItem}}
   */
  items: [],

  /**
   * Identities that this item represents.
   * @type {Array{Object}}
   */
  identities: []

});
