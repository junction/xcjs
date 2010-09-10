/**
 * Mixin for discoverable services.
 * This provides a registration mechanism for
 * features, items, and identities for Service Discovery.
 *
 * @namespace
 * @see XC.Service.Disco
 */
XC.Mixin.Discoverable = {

  /**
   * The root of the Disco tree.
   *
   * @type {XC.DiscoItem}
   * @private
   */
  _rootNode: null,

  getFeatures: function (nodeName) {
    var node = nodeName ? this._rootNode.nodes[nodeName] : this._rootNode;
    if (node && node.features) {
      return node.features;
    }
    return null;
  },

  getIdentities: function (nodeName) {
    var node = nodeName ? this._rootNode.nodes[nodeName] : this._rootNode;
    if (node && node.identities) {
      return node.identities;
    }
    return null;
  },

  getItems: function (nodeName) {
    var node = nodeName ? this._rootNode.nodes[nodeName] : this._rootNode;
    if (node && node.items) {
      return node.items;
    }
    return null;
  },

  /**
   * @private
   */
  _createNode: function (node) {
    if (!this._rootNode) {
      this._rootNode = {
        identities: [],
        features: [],
        items: [],
        nodes: {}
      };
    }

    if (node && !this._rootNode.nodes[node]) {
      this._rootNode.nodes[node] = {
        identities: [],
        features: [],
        items: []
      };
    }

    return node ? this._rootNode.nodes[node] : this._rootNode;
  },

  /**
   * Add a feature to the Disco tree.
   *
   * @param {String} xmlns   The namespace of the feature to add.
   * @param {String} [node]  The name of the node to add the feature to.
   *
   * @returns {XC.Discoverable} The calling object.
   */
  addFeature: function (xmlns, node) {
    node = this._createNode(node);

    if (!node.features) {
      node.features = [];
    }

    node.features.push(xmlns);

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
   * @param {String}       [nodeName] The name of the node to add the item to.
   *
   * @returns {XC.Discoverable} The calling object.
   */
  addItem: function (discoItem, nodeName) {
    var node = this._createNode(nodeName);

    if (node) {
      if (!nodeName) {
        if (!node.items) {
          node.items = [];
        }
        node.items.push(discoItem);
      } else {
        if (!node.items) {
          node.items = [];
        }
        node.items.push(discoItem);
      }
    }
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
    node = this._createNode(node);

    if (!node.identities) {
      node.identities = [];
    }

    node.identities.push(identity);
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
