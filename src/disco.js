/**
 * Service Discovery provides the ability to discover information about entities.
 * @namespace
 * 
 * XEP-0030: Service Discovery
 * @see http://xmpp.org/extensions/xep-0030.html
 * 
 * @requires rootItem  A list of features and items associated with your entity.
 */
XC.Disco = {

  XMLNS: 'http://jabber.org/protocol/disco',

  /**
   * @param {XC.Entity} entity
   * @param {Object}    [callbacks]
   */
  info: function (entity, callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: this.XMLNS + '#info'});
    iq.type('get');
    iq.to(entity.jid);

    if (entity.disco && entity.disco.name) {
      q.attr('node', entity.disco.name);
    }

    iq.addChild(q);

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        var identities = packet.getElementsByTagName('identity'),
            features = packet.getElementsByTagName('feature'),
            iFeat = features ? features.length : 0,
            iIdent = identities ? identities.length : 0,
            identity;

        entity.disco.features = [];
        while (iFeat--) {
          entity.disco.addFeature(features[iFeat].getAttribute('var'));
        }

        entity.disco.identities = [];
        while (iIdent--) {
          identity = identities[iIdent];
          entity.disco.addIdentity({
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
   * @param {XC.Entity} entity
   * @param {Object}    [callbacks]
   */
  items: function (entity, callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: this.XMLNS + '#items'});
    iq.type('get');
    iq.to(entity.jid);
    iq.addChild(q);

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        var items = packet.getElementsByTagName('item'),
            item, idx = items ? items.length : 0;

        entity.disco.items = {};
        while (idx--) {
          entity.disco.addItem(XC.DiscoItem.extend({
            jid: items[idx].jid,
            name: items[idx].name
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
  rootItem: null
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
   * Associative array of all items in this item.
   * @type {Object{XC.DiscoItem}}
   */
  items: {},

  /**
   * Identities that this item represents.
   * @type {Array{Object}}
   */
  identities: [],

  /**
   * Add a feature to this item.
   * @param {String} xmlns The namespace of the feature to add.
   * @returns {Boolean} True if it was added; false if it already exists.
   */
  addFeature: function (xmlns) {
    var idx = this.features.length;
    while (idx--) {
      if (this.features[idx] === xmlns) {
        XC.warn('The feature "' + xmlns + '" has already been added.');
        return false;
      }
    }
    this.features.push(xmlns);
    return true;
  },

  /**
   * Remove a pre-existing feature from this item.
   * @param {String} xmlns The namespace of the feature to remove.
   * @returns {Boolean} True if it was removed; false if it doesn't exist.
   */
  removeFeature: function (xmlns) {
    var idx = this.features.length;
    while (idx--) {
      if (this.features[idx] === xmlns) {
        var rest = this.features.slice(idx + 1);
        this.features.length = idx;
        this.features = this.features;
        return true;
      }
    }
    return false;
  },

  /**
   * Add a child item to this item.
   * @param {XC.DiscoItem} discoItem The item to add.
   * @returns {Boolean} True if it was added; false if it already exists.
   */
  addItem: function (discoItem) {
    if (!this.items[discoItem.name]) {
      this.items[discoItem.name] = discoItem;
      return true;
    }
    return false;
  },

  /**
   * Remove a pre-existing item from this item.
   * @param {XC.DiscoItem} discoItem The item to remove.
   * @returns {Boolean} True if it was removed; false if it doesn't exist.
   */
  removeItem: function (discoItem) {
    if (this.items[discoItem.name]) {
      delete this.items[discoItem.name];
      return true;
    }
    return false;
  },

  /**
   * Add an identity to this item.
   * {
   *   category: {String},
   *   name: {String},
   *   type: {String}
   * }
   * @param {Object} identity The identity to add.
   * @returns {Boolean} True if it was added; false if it already exists.
   */
  addIdentity: function (identity) {
    var idx = this.identities.length,
        i;
    while (idx--) {
      i = this.identities[idx];
      if (identity.category === i.category &&
          identity.type === i.type &&
          identity.name && i.name && identity.name === i.name) {
        XC.warn('The identity has already been added: ' + i);
        return false;
      }
    }
    this.identities.push(identity);
    return true;
  },

  /**
   * Remove a pre-existing identity from this item.
   * @param {Object} identity The identity to remove.
   * @returns {Boolean} True if it was removed; false if it doesn't exist.
   */
  removeIdentity: function (identity) {
    var idx = this.identities.length,
        i;
    while (idx--) {
      i = this.identities[idx];
      if (identity.category === i.category &&
          identity.type === i.type &&
          identity.name && i.name && identity.name === i.name) {
        delete this.identities[idx];
        return true;
      }
    }
    return false;
  },

  /**
   * Disco items request on this item.
   * @param {Element} packet
   */
  getItems: function (packet) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Disco.XMLNS + '#items'}),
        Item = XC.XML.Element.extend({name: 'item'}),
        item;

    iq.type('result');
    iq.to(packet.from);

    for (var jid in this.items) {
      item = Item.extend();
      item.attr('jid', jid);
      if (this.items[jid]) {
        item.attr('name', this.items[jid]);
      }
      q.addChild(item);
    }
    iq.addChild(q);
    this.connection.send(iq.convertToString());
  },

  /**
   * Disco info request on this item.
   * @param {XC.Entity} entity
   */
  getInfo: function (packet) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Disco.XMLNS + '#info'}),
        Feature = XC.XML.Element.extend({name: 'feature'}),
        Identity = XC.XML.Element.extend({name: 'identity'}),
        identity, elem, idx;

    iq.type('result');
    iq.to(packet.from);

    idx = this.identities.length;
    while (idx--) {
      identity = this.identities[idx];
      elem = Identity.extend();
      elem.attr('category', identity.category);
      elem.attr('type', identity.type);
      if (identity.name) {
        elem.attr('name', identity.name);
      }
      q.addChild(elem);
    }

    idx = this.features.length;
    while (idx--) {
      elem = Feature.extend();
      elem.attr('var', this.features[idx]);
      q.addChild(elem);
    }

    iq.addChild(q);
    this.connection.send(iq.convertToString());
  }

});
