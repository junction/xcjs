/*globals YAHOO */
XC.Test.Stanza = new YAHOO.tool.TestCase({
  name: 'XC Stanza Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});

    this.packet = XC.Test.Packet.extendWithXML(
      '<message from="hage-san@okinawa.com"\
                to="hanzo@okinawa.com"\
                type="chat"\
                id="msg1">\
         <body>How come I always have to get the sake? You listen well... for thirty years, you make the fish, I get the sake. If this were the military, I\'d be General by now!</body>\
       </message>'
    );
  },

  tearDown: function() {
    delete this.conn;
    delete this.xc;
    delete this.packet;
  },

  testInit: function () {
    var Assert = YAHOO.util.Assert;

    // Test nothing
    var stanza = XC.Stanza.extend();
    Assert.isNull(stanza.to);
    Assert.isNull(stanza.from);
    Assert.isNull(stanza.id);
    Assert.isNull(stanza.type);

    // Test illegal invocation
    var that = this;
    Assert.throws(XC.Error, function () {
      XC.Stanza.extend({
       packet: that.packet
      });
    }, "Illegal stanza invocation didn't happen as expected.");

    // Test our stanza
    stanza = XC.Stanza.extend({
      packet: this.packet,
      connection: this.xc
    });
    Assert.isObject(stanza.to);
    Assert.areEqual(stanza.to.jid, 'hanzo@okinawa.com');
    Assert.isObject(stanza.from);
    Assert.areEqual(stanza.from.jid, 'hage-san@okinawa.com');

    Assert.areEqual(stanza.type, 'chat');
    Assert.areEqual(stanza.id, 'msg1');
  },

  testToStanzaXML: function () {
    var Assert = YAHOO.util.Assert;

    Assert.throws(XC.Error, function () {
      XC.Stanza.extend().toStanzaXML();
    });

    var stanza = XC.Stanza.extend({
      xmlStanza: XC.XML.Element.extend({name: 'foo'})
    }), xmlStanza = stanza.toStanzaXML();

    Assert.areEqual('<foo></foo>', xmlStanza.convertToString());

    stanza.to = XC.Entity.extend({jid: 'hage-san@okinawa.com'});
    stanza.from = XC.Entity.extend({jid: 'hanzo@okinawa.com'});
    stanza.type = 'bar';

    Assert.XPathTests(stanza.toStanzaXML().convertToString(), {
      to: {
        xpath: '/foo/@to',
        value: stanza.to.jid
      },
      from: {
        xpath: '/foo/@from',
        value: stanza.from.jid
      },
      type: {
        xpath: '/foo/@type',
        value: stanza.type
      },
      id: {
        xpath: '/foo/@id',
        value: undefined
      }
    });
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Stanza);
