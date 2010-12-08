/**
 * @class
 * Service Discovery provides the ability to discover information about entities.
 *
 * @see <a href="http://xmpp.org/extensions/xep-0030.html">XEP-0030: Service Discovery</a>
 */
XC.Mixin.Disco = /** @lends XC.Mixin.Disco# */{

  /**
   * @private
   * The root node of the Disco 'tree' that contains
   * all of the information queried.
   * 
   * @type Object
   */
  _rootNode: null,

  /**
   * @private
   * Creates nodes through lazy instantiation.
   *
   * @param {String} [node] The node to create
   * @returns {Object} The node that was asked to be created.
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
   * Returns a list of features on a given node,
   * or the features on the root node.
   * 
   * @param {String} [nodeName] The name of the node to query for features on.
   * @returns {String[]} A list of features on the node.
   */
  getDiscoFeatures: function (nodeName) {
    var node = this._rootNode && nodeName ? this._rootNode.nodes[nodeName] : this._rootNode;
    if (node && node.features) {
      return node.features;
    }
    return null;
  },

  /**
   * Returns a list of identities on a given node,
   * or the identities on the root node.
   * 
   * @param {String} [nodeName] The name of the node to query for identites on.
   * @returns {Object[]} A list of identites on the node.
   *                     Each item has a slot 'category' and 'type' and
   *                     an optional 'name' slot.
   */
  getDiscoIdentities: function (nodeName) {
    var node = this._rootNode && nodeName ? this._rootNode.nodes[nodeName] : this._rootNode;
    if (node && node.identities) {
      return node.identities;
    }
    return null;
  },

  /**
   * Returns a list of  items on a given node,
   * or the items on the root node.
   * 
   * @param {String} [nodeName] The name of the node to query for items on.
   * @returns {Object[]} A list of items on the node.
   *                     Each item has a slot 'jid', and may have
   *                     the optional slots 'node' or 'name' filled.
   */
  getDiscoItems: function (nodeName) {
    var node = this._rootNode && nodeName ? this._rootNode.nodes[nodeName] : this._rootNode;
    if (node && node.items) {
      return node.items;
    }
    return null;
  },

  /**
   * Discover information about an entity.
   *
   * @param {String} [nodeName] The node to query for info on the entity.
   * @param {Object} [callbacks]
   *    An Object with methods 'onError' and 'onSuccess'.
   *   @param {Function} [callbacks.onError]
   *      A function that will process disco#info errors.
   *     @param {XC.PacketAdapter} [callbacks.onError#packet]
   *        The packet that produced the error.
   *   @param {Function} [callbacks.onSuccess]
   *      A function that will be called on a successful disco#info.
   *     @param {XC.Entity} [callbacks.onSuccess#entity]
   *        The entity with slots filled about the queried disco information.
   * @returns {void}
   */
  requestDiscoInfo: function (nodeName, callbacks) {
    var iq = XC.XML.XMPP.IQ.extend(),
        q = XC.XML.XMPP.Query.extend({xmlns: XC.Registrar.Disco.XMLNS + '#info'}),
        entity = this;

    if (arguments.length === 1) {
      callbacks = nodeName;
      nodeName = null;
    }

    iq.type('get');
    iq.to(entity.jid);
    iq.addChild(q);

    if (nodeName) {
      q.attr('node', nodeName);
    }

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError &&
          XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else {
        packet = packet.getNode();
        var identities = packet.getElementsByTagName('identity'),
            features = packet.getElementsByTagName('feature'),
            node = packet.getElementsByTagName('query')[0].getAttribute('node'),
            len, i, identity;

        node = entity._createNode(node);

        node.features = [];
        len = features ? features.length : 0;
        for (i = 0; i < len; i++) {
          node.features.push(features[i].getAttribute('var'));
        }

        node.identities = [];
        len = identities ? identities.length : 0;
        for (i = 0; i < len; i++) {
          identity = identities[i];
          node.identities.push({
            category: identity.getAttribute('category'),
            type: identity.getAttribute('type'),
            name: identity.getAttribute('name')
          });
        }
        if (callbacks && callbacks.onSuccess &&
            XC.isFunction(callbacks.onSuccess)) {
          callbacks.onSuccess(entity);
        }
      }
    });
  },

  /**
   * Discover the items on an entity.
   *
   * @param {Object}  [node]      The node to query for i on the entity.
   * @param {Object}  [callbacks] An Object with methods 'onError' and 'onSuccess'.
   *   @param {Function} [callbacks.onError] A function that will process disco#items errors.
   *     @param {XC.PacketAdapter} [callbacks.onError#packet] The packet that produced the error.
   *   @param {Function} [callbacks.onSuccess] A function that will be called on a successful disco#items.
   *     @param {XC.Entity} [callbacks.onSuccess#entity] The entity with slots filled about the queried disco items.
   * @returns {void}
   */
  requestDiscoItems: function (node, callbacks) {
    var iq = XC.XML.XMPP.IQ.extend(),
        q = XC.XML.XMPP.Query.extend({xmlns: XC.Registrar.Disco.XMLNS + '#items'}),
        entity = this;

    if (arguments.length === 1) {
      callbacks = node;
      node = null;
    }

    iq.type('get');
    iq.to(entity.jid);
    iq.addChild(q);

    if (node) {
      q.attr('node', node);
    }

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError && XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else {
        packet = packet.getNode();
        var items = packet.getElementsByTagName('item'),
            node = packet.getElementsByTagName('query')[0].getAttribute('node'),
            len = items ? items.length : 0;

        node = entity._createNode(node);

        node.items = [];
        for (var i = 0; i < len; i++) {
          node.items.push({
            jid: items[i].getAttribute('jid'),
            node: items[i].getAttribute('node'),
            name: items[i].getAttribute('name')
          });
        }
        if (callbacks && callbacks.onSuccess && XC.isFunction(callbacks.onSuccess)) {
          callbacks.onSuccess(entity);
        }
      }
    });
  }

};
