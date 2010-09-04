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
   */
  _rootNode: null,

  getNode: function (node) {
    return node ? this._rootNode.items[node] : this._rootNode;
  },

  _createNode: function (node) {
    if (!this._rootNode) {
      this._rootNode = XC.DiscoItem.extend({
        identities: [],
        features: [],
        items: {}
      });
    }

    if (node && !this._rootNode.items[node]) {
      this._rootNode.items[node] = XC.DiscoItem.extend({
        identities: [],
        features: [],
        items: []
      });
    }

    return this.getNode(node);
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
        features = this.getNode(node).features;

    idx = features.length;

    while (idx--) {
      if (features[idx] === xmlns) {
        var rest = features.slice(idx + 1);
        features.length = idx;
        features.push(rest);
        return true;
      }
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
          node.items = {};
        }
        node.items[discoItem.node] = discoItem;
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
  removeItem: function (discoItem, node) {
    node = this.getNode(node);
    var idx = node.items.length;

    while (idx--) {
      if (node.items[idx] === discoItem) {
        delete node.items[idx];
        return true;
      }
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
    var idx, i;
    node = this.getNode(node);

    idx = node ? node.identities.length : 0;
    while (idx--) {
      i = node.identities[idx];
      if (identity === i) {
        delete node.identities[idx];
        return true;
      }
    }
    return false;
  }

};
