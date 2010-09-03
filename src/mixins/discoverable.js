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
   * Add a feature to this item.
   * 
   * @param {String} xmlns The namespace of the feature to add.
   * @param {String} [node]  The name of the node to add the feature to.
   * 
   * @returns {XC.Discoverable} The calling object.
   */
  addFeature: function (xmlns, node) {
    if (!this.disco) {
      this.disco = XC.DiscoItem.extend();      
    }

    if (node) {
      this.disco.items[node].features.push(xmlns);
    } else {
      this.disco.features.push(xmlns);
    }
    return this;
  },

  /**
   * Remove a pre-existing feature from this item.
   * 
   * @param {String} xmlns The namespace of the feature to remove.
   * @param {String} [node]  The name of the node to add the feature to.
   * 
   * @returns {Boolean} True if it was removed; false if it doesn't exist.
   */
  removeFeature: function (xmlns, node) {
    var idx,
        features = this.disco.features;

    if (node) {
      features = this.disco.items[node].features;
    }
    
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
   * @param {XC.DiscoItem} discoItem The item to add.
   * 
   * @returns {XC.Discoverable} The calling object.
   */
  addItem: function (discoItem) {
    if (!this.disco) {
      this.disco = XC.DiscoItem.extend();   
    }

    this.disco.items.push(discoItem);
    return this;
  },

  /**
   * Remove a pre-existing item from this item.
   * 
   * @param {XC.DiscoItem} discoItem The item to remove.
   *
   * @returns {Boolean} True if it was removed; false if it doesn't exist.
   */
  removeItem: function (discoItem) {
    if (this.disco.items[discoItem.node]) {
      delete this.disco.items[discoItem.node];
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
   * 
   * @returns {XC.Discoverable} The calling object.
   */
  addIdentity: function (identity) {
    if (!this.disco) {
      this.disco = XC.DiscoItem.extend();      
    }

    this.disco.identities.push(identity);
    return this;
  },

  /**
   * Remove a pre-existing identity from this item.
   * 
   * @param {Object} identity The identity to remove.
   * 
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
  }

};
