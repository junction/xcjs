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
  info: function (entity, callbacks) {},

  /**
   * @param {XC.Entity} entity
   * @param {Object}    [callbacks]
   */
  items: function (entity, callbacks) {},

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
   * The name of the node.
   * @type {String}
   */
  name: '',

  /**
   * Namespaces of supported features.
   * @type {String}
   */
  features: [],

  /**
   * Associative array of all items in this item.
   * @type {XC.DiscoItem}
   */
  items: {},

  /**
   * Identities that this item represents.
   * @type {Object}
   */
  identities: [],

  /**
   * Add a feature to this item.
   * @param {String} xmlns The namespace of the feature to add.
   */
  addFeature: function (xmlns) {},

  /**
   * Remove a pre-existing feature from this item.
   * @param {String} xmlns The namespace of the feature to remove.
   */
  removeFeature: function (xmlns) {},

  /**
   * Add a child item to this item.
   * @param {XC.DiscoItem} discoItem The item to add.
   */
  addItem: function (discoItem) {},

  /**
   * Remove a pre-existing item from this item.
   * @param {XC.DiscoItem} discoItem The item to remove.
   */
  removeItem: function (discoItem) {},

  /**
   * Add an identity to this item.
   * {
   *   category: {String},
   *   name: {String},
   *   type: {String}
   * }
   * @param {Object} identity The identity to add.
   */
  addIdentity: function (identity) {},

  /**
   * Remove a pre-existing identity from this item.
   * @param {Object} identity The identity to remove.
   */
  removeIdentity: function (identity) {},

  /**
   * Disco items request on this item.
   * @param {XC.Entity} entity
   */
  getItems: function (entity) {},

  /**
   * Disco info request on this item.
   * @param {XC.Entity} entity
   */
  getInfo: function (entity) {}

});
