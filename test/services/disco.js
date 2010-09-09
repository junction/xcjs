/*globals YAHOO */
XC.Test.Service.Disco = new YAHOO.tool.TestCase({
  name: 'XC Disco Service Tests',

  ran: false,
  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

    this.Disco = this.xc.Disco;

    // Do this once.
    if (this.ran) {
      return;
    }
    this.ran = true;

    this.Disco.addItem({
      jid: this.conn.jid(),
      node: 'http://jabber.org/protocol/tune',
      name: "Romeo's slow jams"
    });
    this.Disco.addFeature('A', 'http://jabber.org/protocol/tune')
              .addFeature('B', 'http://jabber.org/protocol/tune')
              .addFeature('C', 'http://jabber.org/protocol/tune');
    this.Disco.addItem({jid: 'pubsub.shakespeare.lit',
                        name: "Romeo's CD player",
                        node: "CD"}, 'http://jabber.org/protocol/tune');
    this.Disco.addItem({jid: 'pubsub.montague.net',
                        node: "music/R/Romeo/iPod"}, 'http://jabber.org/protocol/tune');

  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isObject(XC.Service.Disco, "Disco is not available.");
    Assert.isObject(this.Disco, "Disco was not mixed in properly.");
    Assert.areSame(this.xc, this.Disco.connection);
  },

  testDiscoInfo: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="' + this.conn.jid() + '" \
           from="juliet@example.com" \
           type="get" \
           id="test"> \
         <query xmlns="http://jabber.org/protocol/disco#info"/> \
       </iq>'
    );
    this.Disco._handleDiscoInfo(packet);

    var result = XC.Test.Packet.extendWithXML(this.conn._data),
        query = result.getNode().firstChild;
    Assert.areEqual(query.getAttribute('xmlns'), "http://jabber.org/protocol/disco#info",
                   "The xml namespaces do not match.");
    Assert.areEqual(result.getTo(), packet.getFrom(),
                   "The to jid does not match the from jid.");
    Assert.areEqual(result.getType(), "result",
                   "The return type is not 'result'.");
    var implemented = {
      "http://jabber.org/protocol/disco#info": true,
      "http://jabber.org/protocol/disco#items": true
    },
    features = query.getElementsByTagName('feature'),
    idx = features.length;

    while (idx--) {
      Assert.isTrue(features[idx].getAttribute('var') in implemented,
                    features[idx].getAttribute('var') + " is not documented as being implemented.");
    }
  },

  testDiscoInfoNode: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="' + this.conn.jid() + '" \
           from="juliet@example.com" \
           type="get" \
           id="test"> \
         <query xmlns="http://jabber.org/protocol/disco#info" \
                node="http://jabber.org/protocol/tune"/> \
       </iq>'
    );
    this.Disco._handleDiscoInfo(packet);

    var result = XC.Test.Packet.extendWithXML(this.conn._data),
        query = result.getNode().firstChild;
    Assert.areEqual(query.getAttribute('xmlns'), "http://jabber.org/protocol/disco#info",
                   "The xml namespaces do not match.");
    Assert.areEqual(query.getAttribute('node'), "http://jabber.org/protocol/tune",
                   "The nodes do not match.");
    Assert.areEqual(result.getTo(), packet.getFrom(),
                   "The to jid does not match the from jid.");
    Assert.areEqual(result.getType(), "result",
                   "The return type is not 'result'.");

    var implemented = {
      "A": true,
      "B": true,
      "C": true
    },
    features = query.getElementsByTagName('feature'),
    idx = features.length;

    while (idx--) {
      Assert.isTrue(features[idx].getAttribute('var') in implemented,
                    features[idx].getAttribute('var') + " is not documented as being implemented.");
    }
  },

  testDiscoItems: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="' + this.conn.jid() + '" \
           from="juliet@example.com" \
           type="get" \
           id="test"> \
         <query xmlns="http://jabber.org/protocol/disco#items"/> \
       </iq>'
    );
    this.Disco._handleDiscoItems(packet);

    var result = XC.Test.Packet.extendWithXML(this.conn._data);
    Assert.areEqual(result.getNode().firstChild.getAttribute('xmlns'), "http://jabber.org/protocol/disco#items",
                   "The xml namespaces do not match.");
    Assert.areEqual(result.getTo(), packet.getFrom(),
                   "The to jid does not match the from jid.");
    Assert.areEqual(result.getType(), "result",
                   "The return type is not 'result'.");
    Assert.areEqual(result.getNode().getElementsByTagName('item').length, 1,
                  "There are items that were not registered.");
    var item = result.getNode().getElementsByTagName('item')[0];

    // Test the root node's item collection.
    Assert.areEqual(item.getAttribute('jid'), this.conn.jid(),
                   "The expected JID for the item was incorrect.");
    Assert.areEqual(item.getAttribute('node'), "http://jabber.org/protocol/tune",
                    "The expected node was incorrect.");
    Assert.areEqual(item.getAttribute('name'), "Romeo's slow jams",
                    "The expected name was incorrect.");
  },

  testDiscoItemsNode: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="' + this.conn.jid() + '" \
           from="juliet@example.com" \
           type="get" \
           id="test"> \
         <query xmlns="http://jabber.org/protocol/disco#items" \
                node="http://jabber.org/protocol/tune"/> \
       </iq>'
    );
    this.Disco._handleDiscoItems(packet);

    var result = XC.Test.Packet.extendWithXML(this.conn._data),
        query = result.getNode().firstChild;

    Assert.areEqual(query.getAttribute('xmlns'), "http://jabber.org/protocol/disco#items",
                   "The xml namespaces do not match.");
    Assert.areEqual(query.getAttribute('node'), "http://jabber.org/protocol/tune",
                   "The nodes do not match.");
    Assert.areEqual(result.getTo(), packet.getFrom(),
                   "The to jid does not match the from jid.");
    Assert.areEqual(result.getType(), "result",
                   "The return type is not 'result'.");
    Assert.areEqual(query.getElementsByTagName('item').length, 2,
                  "There are items that were not registered.");

    var items = query.getElementsByTagName('item');

    Assert.areEqual(items[0].getAttribute('jid'), "pubsub.shakespeare.lit",
                   "The expected JID for the item was incorrect.");
    Assert.areEqual(items[0].getAttribute('node'), "CD",
                    "The expected node was incorrect.");
    Assert.areEqual(items[0].getAttribute('name'), "Romeo's CD player",
                    "The expected name was incorrect.");

    Assert.areEqual(items[1].getAttribute('jid'), "pubsub.montague.net",
                   "The expected JID for the item was incorrect.");
    Assert.areEqual(items[1].getAttribute('node'), "music/R/Romeo/iPod",
                    "The expected node was incorrect.");
  },

  testDiscoInfoNodeError: function () {
    var Assert = YAHOO.util.Assert;
 
    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="' + this.conn.jid() + '" \
           from="juliet@example.com" \
           type="get" \
           id="test"> \
         <query xmlns="http://jabber.org/protocol/disco#info" \
                node="bollocks"/> \
       </iq>'
    );
    this.Disco._handleDiscoInfo(packet);

    var result = XC.Test.Packet.extendWithXML(this.conn._data);
    Assert.areEqual(result.getNode().firstChild.getAttribute('xmlns'), "http://jabber.org/protocol/disco#info",
                   "The xml namespaces do not match.");
    Assert.areEqual(result.getTo(), packet.getFrom(),
                   "The to jid does not match the from jid.");
    Assert.areEqual(result.getType(), "error",
                   "The return type is not 'error'.");

    var error = result.getNode().getElementsByTagName('error')[0];
    Assert.areEqual(error.getAttribute('type'), 'cancel',
                    "The error is not of type 'cancel'");
    Assert.areEqual(error.firstChild.tagName, 'item-not-found',
                    "The error's child element is not 'item-not-found'");
    Assert.areEqual(error.firstChild.getAttribute('xmlns'), 'urn:ietf:params:xml:ns:xmpp-stanzas',
                    "The error's child element does not have the xml namespace \
                     'urn:ietf:params:xml:ns:xmpp-stanzas'");
  },

  testDiscoItemsNodeError: function () {
    var Assert = YAHOO.util.Assert;
 
    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="' + this.conn.jid() + '" \
           from="juliet@example.com" \
           type="get" \
           id="test"> \
         <query xmlns="http://jabber.org/protocol/disco#items" \
                node="bollocks"/> \
       </iq>'
    );

    this.Disco._handleDiscoItems(packet);

    var result = XC.Test.Packet.extendWithXML(this.conn._data);
    Assert.areEqual(result.getNode().firstChild.getAttribute('xmlns'), "http://jabber.org/protocol/disco#items",
                   "The xml namespaces do not match.");
    Assert.areEqual(result.getTo(), packet.getFrom(),
                   "The to jid does not match the from jid.");
    Assert.areEqual(result.getType(), "error",
                   "The return type is not 'error'.");
    
    var error = result.getNode().getElementsByTagName('error')[0];
    Assert.areEqual(error.getAttribute('type'), 'cancel',
                    "The error is not of type 'cancel'");
    Assert.areEqual(error.firstChild.tagName, 'item-not-found',
                    "The error's child element is not 'item-not-found'");
    Assert.areEqual(error.firstChild.getAttribute('xmlns'), 'urn:ietf:params:xml:ns:xmpp-stanzas',
                    "The error's child element does not have the xml namespace \
                     'urn:ietf:params:xml:ns:xmpp-stanzas'");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Service.Disco);
