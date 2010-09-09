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
  XMLNS: 'http://jabber.org/protocol/disco'
};

XC.Mixin.Disco = {

  _rootNode: null,

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

  getDiscoFeatures: function (nodeName) {
    var node = nodeName ? this._rootNode.nodes[nodeName] : this._rootNode;
    if (node && node.features) {
      return node.features;
    }
    return null;
  },

  getDiscoIdentities: function (nodeName) {
    var node = nodeName ? this._rootNode.nodes[nodeName] : this._rootNode;
    if (node && node.identities) {
      return node.identities;
    }
    return null;
  },

  getDiscoItems: function (nodeName) {
    var node = nodeName ? this._rootNode.nodes[nodeName] : this._rootNode;
    if (node && node.items) {
      return node.items;
    }
    return null;
  },

  /**
   * Discover information about an entity.
   *
   * @param {Object}    [callbacks]
   */
  requestDiscoInfo: function (node, callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Disco.XMLNS + '#info'}),
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
      if (packet.getType() === 'error') {
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
        callbacks.onSuccess(entity);
      }
    });
  },

  /**
   * Discover the items on an entity.
   *
   * @param {Object}    [callbacks]
   */
  requestDiscoItems: function (node, callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Disco.XMLNS + '#items'}),
        entity = this;

    if (arguments.length === 1) {
      callbacks = node;
      node = null;
    }

    iq.type('get');
    iq.to(entity.jid);
    iq.addChild(q);

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        packet = packet.getNode();
        var items = packet.getElementsByTagName('item'),
            node = packet.getElementsByTagName('query')[0].getAttribute('node'),
            item, len = items ? items.length : 0;

        node = entity._createNode(node);

        node.items = [];
        for (var i = 0; i < len; i++) {
          node.items.push({
            jid: items[i].getAttribute('jid'),
            node: items[i].getAttribute('node'),
            name: items[i].getAttribute('name')
          });
        }

        callbacks.onSuccess(entity);
      }
    });
  }

};
