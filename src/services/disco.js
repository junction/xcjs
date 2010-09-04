/**
 * The Disco Service provides high level support,
 * responding to disco requests on behalf of the user.
 * 
 * @extends XC.Object
 * @extends XC.Mixin.Discoverable
 * @class
 */
XC.Service.Disco = XC.Object.extend(/**@lends XC.Service.Disco */
  XC.Mixin.Discoverable,
{

  /**
   * Something went wrong- gracefully degrade and provide an
   * error message to the querying JID.
   *
   * @param {Element} iq  The iq containing the elements to send.
   */
  _handleError: function (iq) {
    iq.type('error');
    var error = XC.XMPP.Error.extend(),
        itemNotFound = XC.XML.Element.extend({name: 'item-not-found',
                                              xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas'
                                             });
    error.attr('type', 'cancel');
    error.addChild(itemNotFound);
    iq.addChild(error);
    this.connection.send(iq.convertToString());
  },

  /**
   * Disco items request on this entity.
   * 
   * @param {Element} packet
   */
  _handleDiscoItems: function (packet) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Disco.XMLNS + '#items'}),
        Item = XC.XML.Element.extend({name: 'item'}),
        item, node, value;

    iq.type('result');
    iq.to(packet.getFrom());
    iq.addChild(q);

    node = packet.getNode();
    node = node.getElementsByTagName('query')[0].getAttribute('node');
    if (node) {
      q.attr('node', node);
      node = this._rootNode.items[node];
      if (!node) {
        this._handleError(iq);
        return;
      }
    } else {
      node = this._rootNode;
    }

    for (var key in node.items) {
      value = node.items[key];
      item = Item.extend();
      item.attr('jid', value.jid);
      if (value.name) {
        item.attr('name', value.name);
      }
      if (value.node) {
        item.attr('node', value.node);
      }
      q.addChild(item);
    }

    this.connection.send(iq.convertToString());
  },

  /**
   * Disco info request on this entity.
   * 
   * @param {XC.Entity} entity
   */
  _handleDiscoInfo: function (packet) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Disco.XMLNS + '#info'}),
        Feature = XC.XML.Element.extend({name: 'feature'}),
        Identity = XC.XML.Element.extend({name: 'identity'}),
        identity, elem, len, node, i;

    iq.type('result');
    iq.to(packet.from);
    iq.addChild(q);

    node = packet.getNode();
    node = node.getElementsByTagName('query')[0].getAttribute('node');
    if (node) {
      q.attr('node', node);
      node = this._rootNode.items[node];
      if (!node) {
        this._handleError(iq);
        return;
      }
    } else {
      node = this._rootNode;
    }

    len = node.identities ? node.identities.length : 0;
    for (i = 0; i < len; i++) {
      identity = node.identities[i];
      elem = Identity.extend();
      elem.attr('category', identity.category);
      elem.attr('type', identity.type);
      if (identity.name) {
        elem.attr('name', identity.name);
      }
      q.addChild(elem);
    }

    len = node.features ? node.features.length : 0;
    for (i = 0; i < len; i++) {
      elem = Feature.extend();
      elem.attr('var', node.features[i]);
      q.addChild(elem);
    }

    this.connection.send(iq.convertToString());
  }

}).addFeature(XC.Disco.XMLNS + '#info')
  .addFeature(XC.Disco.XMLNS + '#items');
