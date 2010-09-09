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

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/iq/@to',
        value: packet.getFrom()
      },
      type: {
        xpath: '/iq/@type',
        value: 'result'
      },
      info: {
        xpath: '/iq/discoInfo:query/discoInfo:feature[1]/@var',
        value: 'http://jabber.org/protocol/disco#info'
      },
      items: {
        xpath: '/iq/discoInfo:query/discoInfo:feature[2]/@var',
        value: 'http://jabber.org/protocol/disco#items'
      }
    });

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

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/iq/@to',
        value: packet.getFrom()
      },
      type: {
        xpath: '/iq/@type',
        value: 'result'
      },
      node: {
        xpath: '/iq/discoInfo:query/@node',
        value: 'http://jabber.org/protocol/tune'
      },
      A: {
        xpath: '/iq/discoInfo:query/discoInfo:feature[1]/@var',
        value: 'A'
      },
      B: {
        xpath: '/iq/discoInfo:query/discoInfo:feature[2]/@var',
        value: 'B'
      },
      C: {
        xpath: '/iq/discoInfo:query/discoInfo:feature[3]/@var',
        value: 'C'
      }
    });

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

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/iq/@to',
        value: packet.getFrom()
      },
      type: {
        xpath: '/iq/@type',
        value: 'result'
      },
      itemJID: {
        xpath: '/iq/discoItems:query/discoItems:item[1]/@jid',
        value: this.conn.jid()
      },
      itemNode: {
        xpath: '/iq/discoItems:query/discoItems:item[1]/@node',
        value: 'http://jabber.org/protocol/tune'
      },
      itemName: {
        xpath: '/iq/discoItems:query/discoItems:item[1]/@name',
        value: 'Romeo\'s slow jams'
      }
    });

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

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/iq/@to',
        value: packet.getFrom()
      },
      type: {
        xpath: '/iq/@type',
        value: 'result'
      },
      node: {
        xpath: '/iq/discoItems:query/@node',
        value: 'http://jabber.org/protocol/tune'
      },
      firstJID: {
        xpath: '/iq/discoItems:query/discoItems:item[1]/@jid',
        value: "pubsub.shakespeare.lit"
      },
      firstNode: {
        xpath: '/iq/discoItems:query/discoItems:item[1]/@node',
        value: 'CD'
      },
      firstName: {
        xpath: '/iq/discoItems:query/discoItems:item[1]/@name',
        value: 'Romeo\'s CD player'
      },
      secondJID: {
        xpath: '/iq/discoItems:query/discoItems:item[2]/@jid',
        value: "pubsub.montague.net"
      },
      secondNode: {
        xpath: '/iq/discoItems:query/discoItems:item[2]/@node',
        value: 'music/R/Romeo/iPod'
      },
      secondName: {
        xpath: '/iq/discoItems:query/discoItems:item[2]/@name',
        value: undefined
      }
    });

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

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/iq/@to',
        value: packet.getFrom()
      },
      type: {
        xpath: '/iq/@type',
        value: 'error'
      },
      node: {
        xpath: '/iq/discoInfo:query/@node',
        value: 'bollocks'
      },
      errorType: {
        xpath: '/iq/error/@type',
        value: 'cancel'
      },
      errorChild: {
        xpath: '/iq/error/err:item-not-found',
        value: null,
        assert: Assert.areNotEqual
      }
    });

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

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/iq/@to',
        value: packet.getFrom()
      },
      type: {
        xpath: '/iq/@type',
        value: 'error'
      },
      node: {
        xpath: '/iq/discoItems:query/@node',
        value: 'bollocks'
      },
      errorType: {
        xpath: '/iq/error/@type',
        value: 'cancel'
      },
      errorChild: {
        xpath: '/iq/error/err:item-not-found',
        value: null,
        assert: Assert.areNotEqual
      }
    });
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Service.Disco);
