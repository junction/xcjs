/*globals YAHOO */
XC.Test.Mixin.Disco = new YAHOO.tool.TestCase({
  name: 'XC Disco Mixin Tests',

  ran: false,
  setUp: function () {
    this.conn = XC.Test.MockConnection.extend();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});

    this.romeo = this.xc.Entity.extend({
      name: 'Romeo',
      jid: this.conn.jid()
    });
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testDiscoInfoSlots: function () {
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
    ));

    Assert.isFunction(this.romeo.getDiscoFeatures,
                      "'getDiscoFeatures' should be a function.");
    Assert.isFunction(this.romeo.getDiscoIdentities,
                      "'getDiscoIdentities' should be a function.");
    Assert.areEqual(null, this.romeo.getDiscoFeatures(),
                    "'getDiscoFeatures' should be null.");
    Assert.areEqual(null, this.romeo.getDiscoIdentities(),
                    "'getDiscoIdentities' should be null.");

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoInfo({
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity, that.romeo, "Entity should be === to romeo.");

        Assert.isArray(entity.getDiscoFeatures(),
                       "'getDiscoFeatures' should be an Array.");
        Assert.isArray(entity.getDiscoIdentities(),
                       "'getDiscoIdentities' should be an Array.");
      },
      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#info.");
    Assert.isFalse(fail, "Disco#info threw an error.");
  },

  testDiscoInfo: function () {
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
    ));

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoInfo({
      onSuccess: function (entity) {
        win = true;

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
      },

      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#info.");
    Assert.isFalse(fail, "Disco#info threw an error.");
  },

  testDiscoInfoNodeSlots: function () {
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
    ));

    Assert.isFunction(this.romeo.getDiscoFeatures,
                      "'getDiscoFeatures' should be a function.");
    Assert.isFunction(this.romeo.getDiscoIdentities,
                      "'getDiscoIdentities' should be a function.");
    Assert.areEqual(null, this.romeo.getDiscoFeatures('http://jabber.org/protocol/tune'),
                    "'getDiscoFeatures' should be null.");
    Assert.areEqual(null, this.romeo.getDiscoIdentities('http://jabber.org/protocol/tune'),
                    "'getDiscoIdentities' should be null.");

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoInfo({
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity, that.romeo, "Entity should be === to romeo.");

        Assert.isArray(entity.getDiscoFeatures('http://jabber.org/protocol/tune'),
                       "'getDiscoFeatures' should be an Array.");
        Assert.isArray(entity.getDiscoIdentities('http://jabber.org/protocol/tune'),
                       "'getDiscoIdentities' should be an Array.");
      },
      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#info.");
    Assert.isFalse(fail, "Disco#info threw an error.");
  },

  testDiscoInfoNode: function () {
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
    ));

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoInfo('http://jabber.org/protocol/tune', {
      onSuccess: function (entity) {
        win = true;

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
      },

      onError: function (packet) {
        fail = true;
      }
    });

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/iq/@to',
        value: this.romeo.jid
      },
      type: {
        xpath: '/iq/@type',
        value: 'get'
      },
      node: {
        xpath: '/iq/discoInfo:query/@node',
        value: 'http://jabber.org/protocol/tune'
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#info.");
    Assert.isFalse(fail, "Disco#info threw an error.");
  },

  testDiscoInfoError: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="' + this.conn.jid() + '" \
           to="juliet@example.com" \
           type="error" \
           id="test"> \
        <query xmlns="http://jabber.org/protocol/disco#info" \
               error="bollocks"/> \
        <error type="cancel">\
          <item-not-found xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"/> \
        </error> \
      </iq>'
    ));

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoInfo('bollocks', {
      onSuccess: function (entity) {
        win = true;
      },

      onError: function (packet) {
        fail = true;
        Assert.areEqual(packet.getType(), 'error', "The stanza is not of type 'error'");
      }
    });

    Assert.isFalse(win, "Disco#info threw an error.");
    Assert.isTrue(fail, "Was not successful in doing a disco#info.");
  },

  testDiscoItemsSlots: function () {
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
    ));

    Assert.isFunction(this.romeo.getDiscoItems,
                   "'getDiscoItems' should be a function.");
    Assert.areEqual(this.romeo.getDiscoItems(), null,
                   "'getDiscoItems' should return null.");

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoItems({
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity, that.romeo, "The entity should be === to romeo.");
        Assert.isArray(entity.getDiscoItems(),
                       "'getDiscoItems' should return an Array.");
      },

      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#items.");
    Assert.isFalse(fail, "Disco#items threw an error.");
  },

  testDiscoItems: function () {
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
    ));

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoItems({
      onSuccess: function (entity) {
        win = true;

        var items = entity.getDiscoItems();
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

  testDiscoItemsNodeSlots: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="' + this.conn.jid() + '" \
           to="juliet@example.com" \
           type="result" \
           id="test"> \
        <query xmlns="http://jabber.org/protocol/disco#info" \
               node="http://jabber.org/protocol/tune"> \
          <item jid="romeo@example.com" \
                node="http://jabber.org/protocol/tune"/> \
          <item jid="people.shakespeare.lit" \
                name="Directory of Characters"/> \
        </query> \
      </iq>'
    ));

    Assert.isFunction(this.romeo.getDiscoItems,
                   "'getDiscoItems' should be a function.");
    Assert.areEqual(this.romeo.getDiscoItems('http://jabber.org/protocol/tune'), null,
                   "'getDiscoItems' should return null.");

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoItems('http://jabber.org/protocol/tune', {
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity, "Entity should be an object.");
        Assert.areEqual(entity, that.romeo, "The entity should be === to romeo.");
        Assert.isArray(entity.getDiscoItems(),
                       "'getDiscoItems' should return an Array.");
      },

      onError: function (packet) {
        fail = true;
      }
    });

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/iq/@to',
        value: this.romeo.jid
      },
      type: {
        xpath: '/iq/@type',
        value: 'get'
      },
      node: {
        xpath: '/iq/discoItems:query/@node',
        value: 'http://jabber.org/protocol/tune'
      }
    });

    Assert.isTrue(win, "Was not successful in doing a disco#items.");
    Assert.isFalse(fail, "Disco#items threw an error.");
  },

  testDiscoItemsNode: function () {
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
    ));

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoItems('http://jabber.org/protocol/tune', {
      onSuccess: function (entity) {
        win = true;
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

  testDiscoItemsError: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="' + this.conn.jid() + '" \
           to="juliet@example.com" \
           type="error" \
           id="test"> \
        <query xmlns="http://jabber.org/protocol/disco#items" \
               error="bollocks"/> \
        <error type="cancel">\
          <item-not-found xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"/> \
        </error> \
      </iq>'
    ));

    var fail = false, win = false, that = this;
    this.romeo.requestDiscoInfo('bollocks', {
      onSuccess: function (entity) {
        win = true;
      },

      onError: function (packet) {
        fail = true;
        Assert.areEqual(packet.getType(), 'error', "The stanza is not of type 'error'");
      }
    });

    Assert.isFalse(win, "Disco#items threw an error.");
    Assert.isTrue(fail, "Was not successful in doing a disco#items.");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Mixin.Disco);
