/*globals YAHOO */
XC.Test.Disco = new YAHOO.tool.TestCase({
  name: 'XC Disco Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connection: this.conn});
    this.xc.initConnection();

    this.Disco = this.xc.Disco;
    this.romeo = XC.Entity.extend({
      name: 'Romeo',
      jid: 'romeo@example.com',
      connection: this.xc
    });
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

  testInfo: function () {
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

  testItems: function () {
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
  },

  testDiscoItemsResponse: function () {
  },

  testRootItem: function () {
  },

  testDeepTraversal: function () {
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Disco);
