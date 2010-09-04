/*globals YAHOO */
XC.Test.Disco = new YAHOO.tool.TestCase({
  name: 'XC Disco Tests',

  ran: false,
  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

    this.Disco = this.xc.Disco;

    this.romeo = XC.Entity.extend({
      name: 'Romeo',
      jid: this.conn.jid(),
      connection: this.xc
    });

    // For some reason, YUI Test calls setUp
    // way too many times. This prevents that.
    if (this.ran) {
      return;
    }
    this.ran = true;

    this.Disco.addItem(XC.DiscoItem.extend({
      jid: this.conn.jid(),
      node: 'http://jabber.org/protocol/tune',
      name: "Romeo's slow jams",
      features: ['A', 'B', 'C'],
      items: [XC.DiscoItem.extend({jid: 'pubsub.shakespeare.lit',
                                   name: "Romeo's CD player",
                                   node: "CD"}),
              XC.DiscoItem.extend({jid: 'pubsub.montague.net',
                                   node: "music/R/Romeo/iPod"})]
    }));
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

  testDiscoInfoMixin: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="' + this.conn.jid() + '" \
           to="juliet@example.com" \
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
    ).doc.firstChild);

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoInfo({
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity.name, that.romeo.name,
                        "The entity's name is not the same.");
        Assert.areEqual(entity.jid, that.romeo.jid,
                        "The entity's JID is not the same.");
        var features = entity.getDiscoFeatures(),
            identities = entity.getDiscoIdentities();
        Assert.areEqual(features[0], 'jabber:iq:time',
                        "The entity doesn't have an advertised feature.");
        Assert.areEqual(features[1], 'http://jabber.org/protocol/disco#info',
                        "The entity doesn't have an advertised feature.");
        Assert.areEqual(identities[0].name, 'JNX',
                        "The identity's name wasn't copied.");
        Assert.areEqual(identities[0].category, 'client',
                        "The identity's category wasn't copied.");
        Assert.areEqual(identities[0].type, 'web',
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

  testDiscoInfoNodeMixin: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="' + this.conn.jid() + '" \
           to="juliet@example.com" \
           type="result" \
           id="test"> \
        <query xmlns="http://jabber.org/protocol/disco#info" \
               node="http://jabber.org/protocol/tune"> \
          <identity category="service" \
                    type="music" \
                    name="Tunes"/> \
          <feature var="A"/> \
          <feature var="B"/> \
          <feature var="C"/> \
        </query> \
      </iq>'
    ).doc.firstChild);

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoInfo('http://jabber.org/protocol/tune', {
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity.name, that.romeo.name,
                        "The entity's name is not the same.");
        Assert.areEqual(entity.jid, that.romeo.jid,
                        "The entity's JID is not the same.");

        var features = entity.getDiscoFeatures('http://jabber.org/protocol/tune'),
            identities = entity.getDiscoIdentities('http://jabber.org/protocol/tune');
        Assert.areEqual(features[0], 'A',
                        "The entity doesn't have an advertised feature.");
        Assert.areEqual(features[1], 'B',
                        "The entity doesn't have an advertised feature.");
        Assert.areEqual(features[2], 'C',
                        "The entity doesn't have an advertised feature.");

        Assert.areEqual(identities[0].name, 'Tunes',
                        "The identity's name wasn't copied.");
        Assert.areEqual(identities[0].category, 'service',
                        "The identity's category wasn't copied.");
        Assert.areEqual(identities[0].type, 'music',
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

  testDiscoItemsMixin: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="' + this.conn.jid() + '" \
           to="juliet@example.com" \
           type="result" \
           id="test"> \
        <query xmlns="http://jabber.org/protocol/disco#info"> \
          <item jid="romeo@example.com" \
                node="http://jabber.org/protocol/tune"/> \
          <item jid="people.shakespeare.lit" \
                name="Directory of Characters"/> \
        </query> \
      </iq>'
    ).doc.firstChild);

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoItems({
      onSuccess: function (entity) {
        win = true;

        var items = entity.getDiscoItems();
        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity.name, that.romeo.name,
                        "The entity's name is not the same.");
        Assert.areEqual(entity.jid, that.romeo.jid,
                        "The entity's JID is not the same.");
        Assert.areEqual("romeo@example.com", items[0].jid,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual("http://jabber.org/protocol/tune", items[0].node,
                        "The entity doesn't contain an expected item.");

        Assert.areEqual("people.shakespeare.lit", items[1].jid,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual(null, items[1].node,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual("Directory of Characters", items[1].name,
                        "The entity doesn't contain an expected item.");
      },

      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#items.");
    Assert.isFalse(fail, "Disco#items threw an error.");
  },

  testDiscoItemsNodeMixin: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="' + this.conn.jid() + '" \
           to="juliet@example.com" \
           type="result" \
           id="test"> \
        <query xmlns="http://jabber.org/protocol/disco#info" \
               node="http://jabber.org/protocol/tune"> \
          <item jid="pubsub.shakespeare.lit" \
                name="Romeo\'s CD player" \
                node="CD"/> \
          <item jid="pubsub.montague.net" \
                node="music/R/Romeo/iPod"/> \
        </query> \
      </iq>'
    ).doc.firstChild);
        console.log(this.romeo);
    var fail = false, win = false, that = this;
    this.romeo.requestDiscoItems('http://jabber.org/protocol/tune', {
      onSuccess: function (entity) {
        console.log(entity);
        win = true;

        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity.name, that.romeo.name,
                        "The entity's name is not the same.");
        Assert.areEqual(entity.jid, that.romeo.jid,
                        "The entity's JID is not the same.");

        var items = entity.getDiscoItems('http://jabber.org/protocol/tune');
        Assert.areEqual("pubsub.shakespeare.lit", items[0].jid,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual("CD", items[0].node,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual("Romeo\'s CD player", items[0].name,
                        "The entity doesn't contain an expected item.");

        Assert.areEqual("pubsub.montague.net", items[1].jid,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual("music/R/Romeo/iPod", items[1].node,
                        "The entity doesn't contain an expected item.");
        Assert.areEqual(null, items[1].name,
                        "The entity doesn't contain an expected item.");
      },

      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#items.");
    Assert.isFalse(fail, "Disco#items threw an error.");
  },

  testDiscoInfoService: function () {
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

  testDiscoInfoServiceNode: function () {
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

  testDiscoItemsService: function () {
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

  testDiscoItemsServiceNode: function () {
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

  testDiscoInfoServiceNodeError: function () {
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

  testDiscoItemsServiceNodeError: function () {
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

YAHOO.tool.TestRunner.add(XC.Test.Disco);
