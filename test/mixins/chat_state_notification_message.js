/*globals YAHOO */
XC.Test.Mixin.ChatStateNotificationMessage = new YAHOO.tool.TestCase({
  name: 'XC Chat State Notification Message Mixin Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;
    Assert.mixesIn(XC.MessageStanza, XC.Mixin.ChatStateNotification.Message);
  },

  testFeatureRegistration: function () {
    var Assert = YAHOO.util.Assert;
    Assert.areNotEqual(this.xc.Disco.getFeatures().indexOf('http://jabber.org/protocol/chatstates'), -1);
  },

  testSlots: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isString(XC.MessageStanza.chatNotificationState);
  },

  testDefault: function () {
    var Assert = YAHOO.util.Assert;

    var msg = this.xc.MessageStanza.extend();
    Assert.areEqual('active', msg.chatNotificationState);

    Assert.XPathTests(msg.toStanzaXML().convertToString(), {
      active: {
        xpath: '/message/active/node()',
        value: null,
        assert: function () {
          Assert.isNotNull(arguments[1], arguments[2]);
        }
      }
    });
  },

  testCreationFromPacket: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
      '<message to="masses@shakespeare.com"\
                from="king.richard@shakespeare.com">\
         <composing xmlns="http://jabber.org/protocol/chatstates"/>\
       </message>');

    var msg = this.xc.MessageStanza.extend({
      packet: packet
    });
    Assert.areEqual('composing', msg.chatNotificationState);
  },

  testToStanzaXML: function () {
    var Assert = YAHOO.util.Assert;

    var states = ['active', 'composing', 'paused', 'inactive', 'gone'],
        msg = this.xc.MessageStanza.extend();

    for (var i = 0, len = states.length; i < len; i++) {
      msg.chatStateNotificationState = states[i];

      Assert.XPathTests(msg.toStanzaXML().convertToString(), {
        active: {
          xpath: '/message/chatStates:' + states[i] + '/node()',
          value: null,
          assert: function () {
            Assert.isNotNull(arguments[1], arguments[2]);
          }
        }
      });
    }
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Mixin.ChatStateNotificationMessage);
