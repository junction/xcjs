/**
 * Mixin for discoverable services.
 * This provides a registration mechanism for
 * features, items, and identities for Service Discovery.
 *
 * @namespace
 * @borrows initialized {@link XC.Connection} as this.connection
 * @see XC.Service.Disco
 */
XC.Mixin.Discoverable = {

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
   * @type {XC.DiscoItem}
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
   * @private
   */
  _fetchNode: function (node) {
    if (node && !this._rootNode.nodes[node]) {
      this._rootNode.nodes[node] = XC.Mixin.Discoverable._createNode();
    }
    return node ? this._rootNode.nodes[node] : this._rootNode;
  },

  getFeatures: function (nodeName) {
    return this._fetchNode(nodeName).features;
  },

  getIdentities: function (nodeName) {
    return this._fetchNode(nodeName).identities;
  },

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
   * @param {String} xmlns   The namespace of the feature to remove.
   * @param {String} [node]  The name of the node to add the feature to.
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
      features.concat(rest);
      return true;
    }
    return false;
  },

  /**
   * Add a child item to this item.
   *
   * @param {XC.DiscoItem} discoItem  The item to add.
   * @param {String}       [node] The name of the node to add the item to.
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
   * @param {XC.DiscoItem} discoItem The item to remove.
   * @param {String}       [node]    The name of the node to remove the item from.
   *
   * @returns {Boolean} True if it was removed; false if it doesn't exist.
   */
  removeItem: function (item, node) {
    var idx, items = this.getItems(node);

    idx = items.indexOf(item);
    if (idx !== -1) {
      var rest = items.slice(idx + 1);
      items.length = idx;
      items.concat(rest);
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
   * @param {String} [node]   The name of the node to add the identity to.
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
      identities.concat(rest);
      return true;
    }
    return false;
  }
};
