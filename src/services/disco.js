/**
 * The Disco Service provides high level support,
 * responding to disco requests on behalf of the user.
 * 
 * @extends XC.Object, XC.Mixin.Discoverable
 * @class
 */
XC.Service.Disco = XC.Object.extend(/**@lends XC.Service.Disco */
  XC.Mixin.Discoverable,
{
  disco: null,

  _sendError: function (iq) {
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
        q = XC.XMPP.Query.extend({xmlns: XC.Mixin.Disco.XMLNS + '#items'}),
        Item = XC.XML.Element.extend({name: 'item'}),
        item, node, idx;

    iq.type('result');
    iq.to(packet.getFrom());
    iq.addChild(q);

    packet = packet.getNode();
    node = packet.getElementsByTagName('query')[0].getAttribute('node');
    if (node) {
      node = this.disco[node];
      if (!node) {
        this._sendError(iq);
        return;
      }
    } else {
      node = this.disco;
    }

    idx = node.length;
    while (idx--) {
      item = Item.extend();
      item.attr('jid', node.items[idx].jid);
      if (this.items[idx]) {
        item.attr('name', node.items[idx].name);
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
        q = XC.XMPP.Query.extend({xmlns: XC.Mixin.Disco.XMLNS + '#info'}),
        Feature = XC.XML.Element.extend({name: 'feature'}),
        Identity = XC.XML.Element.extend({name: 'identity'}),
        identity, elem, idx, node;

    iq.type('result');
    iq.to(packet.from);
    iq.addChild(q);

    packet = packet.getNode();
    node = packet.getElementsByTagName('query')[0].getAttribute('node');
    if (node) {
      node = this.disco[node];
      if (!node) {
        this._sendError(iq);
        return;
      }
    } else {
      node = this.disco;
    }

    idx = node.identities.length;
    while (idx--) {
      identity = node.identities[idx];
      elem = Identity.extend();
      elem.attr('category', identity.category);
      elem.attr('type', identity.type);
      if (identity.name) {
        elem.attr('name', identity.name);
      }
      q.addChild(elem);
    }

    idx = node.features.length;
    while (idx--) {
      elem = Feature.extend();
      elem.attr('var', node.features[idx]);
      q.addChild(elem);
    }

    this.connection.send(iq.convertToString());
  }

}).addFeature(XC.Mixin.Disco.XMLNS + '#info')
  .addFeature(XC.Mixin.Disco.XMLNS + '#items');
