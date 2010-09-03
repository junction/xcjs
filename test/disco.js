/*globals YAHOO */
XC.Test.Disco = new YAHOO.tool.TestCase({
  name: 'XC Disco Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

    this.Disco = this.xc.Disco;
    this.romeo = XC.Entity.extend({
      name: 'Romeo',
      jid: 'romeo@example.com',
      connection: this.xc
    });
    this.Disco.addItem(XC.DiscoItem.extend({
      node: 'http://jabber.org/protocol/tune',
      name: "Romeo's slow jams",
      jid: 'romeo@example.com',
      items: [XC.DiscoItem.extend({
        jid: 'pubsub.shakespeare.lit',
        name: "Romeo's CD player",
        node: "CD"
      }), XC.DiscoItem.extend({
        jid: 'pubsub.montague.net',
        node: "music/R/Romeo/iPod"
      })]
    }));
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  textMixin: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isObject(XC.Service.Disco, "Disco is not available.");
    Assert.isObject(this.Disco, "Disco was not mixed in properly.");
    Assert.areSame(this.ox, this.Disco.connection);
  },

  testDiscoInfo: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="romeo@example.com" \
           to="juliet@example.net" \
           type="result" \
           id="test"> \
        <query xmlns="http://jabber.org/protocol/disco#info"> \
          <identity category="client" \
                    type="web" \
                    name="JNX"/> \
          <feature var="jabber:iq:time"/> \
          <feature var="http://jabber.org/protocol/disco#info"/> \
        </query> \
      </iq>'
    ));

    var fail = false, win = false, that = this;
    this.romeo.discoInfo({
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity.name, that.romeo.name,
                        "The entity's name is not the same.");
        Assert.areEqual(entity.jid, that.romeo.jid,
                        "The entity's JID is not the same.");
        Assert.isTrue(entity.hasFeature('jabber:iq:time'),
                        "The entity doesn't have an advertised feature.");
        Assert.isTrue(entity.hasFeature('http://jabber.org/protocol/disco#info'),
                        "The entity doesn't have an advertised feature.");
        Assert.areEqual(entity.disco.identities[0].name, 'JNX',
                        "The identity's name wasn't copied.");
        Assert.areEqual(entity.disco.identities[0].category, 'client',
                        "The identity's category wasn't copied.");
        Assert.areEqual(entity.disco.identities[0].type, 'web',
                        "The identity's type wasn't copied.");
        Assert.areEqual(entity, that.romeo);
      },

      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#info.");
    Assert.isFalse(fail, "Disco#info threw an error.");
  },

  testDiscoItems: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="romeo@example.com" \
           to="juliet@example.net" \
           type="result" \
           id="test"> \
        <query xmlns="http://jabber.org/protocol/disco#info"> \
          <item jid="romeo@example.com" \
                node="http://jabber.org/protocol/tune"/> \
          <item jid="people.shakespeare.lit" \
                name="Directory of Characters"> \
        </query> \
      </iq>'
    ));

    var fail = false, win = false, that = this;
    this.romeo.discoItems({
      onSuccess: function (entity) {
        win = true;

        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity.name, that.romeo.name,
                        "The entity's name is not the same.");
        Assert.areEqual(entity.jid, that.romeo.jid,
                        "The entity's JID is not the same.");
        Assert.areEqual("people.shakespeare.lit", entity.disco.items[0].jid,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual(null, entity.disco.items[0].node,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual("Directory of Characters", entity.disco.items[0].name,
                        "The entity doesn't contain an expected item.");

        Assert.areEqual(that.romeo.jid, entity.disco.items[1].jid,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual("http://jabber.org/protocol/tune", entity.disco.items[1].node,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual(null, entity.disco.items[1].name,
                        "The entity doesn't contain an expected item.");
      },

      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#items.");
    Assert.isFalse(fail, "Disco#items threw an error.");
  },

  testDiscoInfoResponse: function () {
    var Assert = YAHOO.util.Assert;
 
    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="romeo@example.com" \
           from="juliet@example.net" \
           type="get" \
           id="test"> \
         <query xmlns="http://jabber.org/protocol/disco#info"/> \
       </iq>'
    );
    this.Disco._handleDiscoInfo(packet);

    var result = XC.Test.Packet.extendWithXML(this.conn._data);
    Assert.areEqual(result.getNode().firstChild.getAttribute('xmlns'), "http://jabber.org/protocol/disco#info",
                   "The xml namespaces do not match.");
    Assert.areEqual(result.getTo(), packet.getFrom(),
                   "The to jid does not match the from jid.");
    Assert.areEqual(result.getType(), "result",
                   "The return type is not 'result'.");
    var implemented = {
      "http://jabber.org/protocol/disco#info": true,
      "http://jabber.org/protocol/disco#items": true
    },
    features = result.getNode().getElementsByTagName('feature'),
    idx = features.length;

    while (idx--) {
      Assert.isTrue(features[idx].getAttribute('var') in implemented,
                    features[idx].getAttribute('var') + " is not documented as being implemented.");
    }
  },

  testDiscoItemsResponse: function () {
    var Assert = YAHOO.util.Assert;
 
    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="romeo@example.com" \
           from="juliet@example.net" \
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
    Assert.areEqual(item.jid, "romeo@example.net",
                   "The expected JID for the item was incorrect.");
    Assert.areEqual(item.node, "http://jabber.org/protocol/tune",
                    "The expected node was incorrect.");
  },

  testDiscoInfoNodeErrorResponse: function () {
    var Assert = YAHOO.util.Assert;
 
    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="romeo@example.com" \
           from="juliet@example.net" \
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

  testDiscoItemsNodeErrorResponse: function () {
    var Assert = YAHOO.util.Assert;
 
    var packet = XC.Test.Packet.extendWithXML(
      '<iq to="romeo@example.com" \
           from="juliet@example.net" \
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

YAHOO.tool.TestRunner.add(XC.Test.Disco);
