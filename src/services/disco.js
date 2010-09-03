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
  _rootItem: null,

  /**
   * Disco items request on this entity.
   * 
   * @param {Element} packet
   */
  _handleDiscoItems: function (packet) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Disco.XMLNS + '#items'}),
        Item = XC.XML.Element.extend({name: 'item'}),
        item, node;

    iq.type('result');
    iq.to(packet.getAttribute('from'));
    
    node = packet.getElementsByTagName('query')[0].getAttribute('node');
    if (node) {
      node = this._rootItem[node];
    } else {
      node = this._rootItem;
    }

    for (var jid in node) {
      item = Item.extend();
      item.attr('jid', jid);
      if (this.items[jid]) {
        item.attr('name', node.disco.items[jid]);
      }
      q.addChild(item);
    }
    iq.addChild(q);
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
        identity, elem, idx, node;

    iq.type('result');
    iq.to(packet.from);

    node = packet.getElementsByTagName('query')[0].getAttribute('node');
    if (node) {
      node = this._rootItem[node];
    } else {
      node = this._rootItem;
    }

    idx = node.disco.identities.length;
    while (idx--) {
      identity = node.disco.identities[idx];
      elem = Identity.extend();
      elem.attr('category', identity.category);
      elem.attr('type', identity.type);
      if (identity.name) {
        elem.attr('name', identity.name);
      }
      q.addChild(elem);
    }

    idx = node.disco.features.length;
    while (idx--) {
      elem = Feature.extend();
      elem.attr('var', node.disco.features[idx]);
      q.addChild(elem);
    }

    iq.addChild(q);
    this.connection.send(iq.convertToString());
  }

}).addFeature(XC.Mixin.Disco.XMLNS + '#info')
  .addFeature(XC.Mixin.Disco.XMLNS + '#items');
