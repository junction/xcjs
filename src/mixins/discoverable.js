/**
 * Mixin for discoverable services.
 * This provides a registration mechanism for
 * features, items, and identities for Service Discovery.
 *
 * @class
 * @requires XC.Connection
 * @see XC.Service.Disco
 */
XC.Mixin.Discoverable = /** @lends XC.Mixin.Discoverable# */{

  /**
   * @private
   */
  init: function ($super) {
    // init the root node
    if (this.connection && !this._rootNode) {
      if (!this.connection._discoverableRootNode) {
        this.connection._discoverableRootNode = XC.Mixin.Discoverable._createNode();
        this.connection._discoverableRootNode.nodes = {};
      }
      this._rootNode = this.connection._discoverableRootNode;
    }

    if (XC.isFunction($super)) {
      $super.apply(this, Array.from(arguments).slice(1));
    }
  }.around(),

  /**
   * The root of the Disco tree.
   *
   * @type XC.DiscoItem
   * @private
   */
  _rootNode: null,

  /**
   * @private
   */
  _createNode: function () {
    return {
      identities: [],
      features: [],
      items: []
    };
  },

  /**
   * Fetch a node. If it exists, retrieve it; otherwise do lazy instantiation.
   * @private
   * @param {String} [node] The name of the node to fetch.
   */
  _fetchNode: function (node) {
    if (node && !this._rootNode.nodes[node]) {
      this._rootNode.nodes[node] = XC.Mixin.Discoverable._createNode();
    }
    return node ? this._rootNode.nodes[node] : this._rootNode;
  },

  /**
   * Retrieve features on a given node. Defaults to the root node.
   * @param {String} [node] The name of the node to fetch.
   */
  getFeatures: function (nodeName) {
    return this._fetchNode(nodeName).features;
  },

  /**
   * Retrieve identities on a given node. Defaults to the root node.
   * @param {String} [node] The name of the node to fetch.
   */
  getIdentities: function (nodeName) {
    return this._fetchNode(nodeName).identities;
  },

  /**
   * Retrieve items on a given node. Defaults to the root node.
   * @param {String} [node] The name of the node to fetch.
   */
  getItems: function (nodeName) {
    return this._fetchNode(nodeName).items;
  },

  /**
   * Add a feature to the Disco tree.
   *
   * @param {String} xmlns   The namespace of the feature to add.
   * @param {String} [node]  The name of the node to add the feature to.
   *
   * @returns {XC.Discoverable} The calling object.
   */
  addFeature: function (xmlns, nodeName) {
    var node = this._fetchNode(nodeName);
    if (node.features.indexOf(xmlns) === -1) {
      node.features.push(xmlns);
    }
    return this;
  },

  /**
   * Remove a pre-existing feature from this item.
   *
   * @param {String} xmlns The namespace of the feature to remove.
   * @param {String} [node] The name of the node to add the feature to.
   *
   * @returns {Boolean} True if it was removed; false if it doesn't exist.
   */
  removeFeature: function (xmlns, node) {
    var idx,
        features = this.getFeatures(node);

    idx = features.indexOf(xmlns);

    if (idx !== -1) {
      var rest = features.slice(idx + 1);
      features.length = idx;
      features.push.apply(features, rest);
      return true;
    }
    return false;
  },

  /**
   * Add a child item to this item.
   *
   * @param {Object} discoItem The item to add.
   * @param {String} discoItem.jid The JID associated with the item.
   * @param {String} [discoItem.node] The node where the item exists.
   * @param {String} [discoItem.name] The name of the item.
   * @param {String} [node] The name of the node to add the item to.
   *
   * @returns {XC.Discoverable} The calling object.
   */
  addItem: function (discoItem, node) {
    this._fetchNode(node).items.push(discoItem);
    return this;
  },

  /**
   * Remove a pre-existing item from this item.
   *
   * @param {Object} discoItem The item to remove.
   * @param {String} [node] The name of the node to remove the item from.
   *
   * @returns {Boolean} True if it was removed; false if it doesn't exist.
   */
  removeItem: function (item, node) {
    var idx, items = this.getItems(node);

    idx = items.indexOf(item);
    if (idx !== -1) {
      var rest = items.slice(idx + 1);
      items.length = idx;
      items.push.apply(items, rest);
      return true;
    }
    return false;
  },

  /**
   * Add an identity to this item.
   *
   * @param {Object} identity The identity to add.
   * @param {String} identity.category The category of the identity.
   * @param {String} identity.type The type of the identity.
   * @param {String} [identity.name] The name of the identity.
   * @param {String} [node] The name of the node to add the identity to.
   *
   * @returns {XC.Discoverable} The calling object.
   */
  addIdentity: function (identity, node) {
    this._fetchNode(node).identities.push(identity);
    return this;
  },

  /**
   * Remove a pre-existing identity from this item.
   *
   * @param {Object} identity The identity to remove.
   * @param {String} [node]   The name of the node to remove the identity from.
   *
   * @returns {Boolean} True if it was removed; false if it doesn't exist.
   */
  removeIdentity: function (identity, node) {
    var idx, identities = this.getIdentities(node);

    idx = identities.indexOf(identity);
    if (idx !== -1) {
      var rest = identities.slice(idx + 1);
      identities.length = idx;
      identities.push.apply(identities, rest);
      return true;
    }
    return false;
  }
};
