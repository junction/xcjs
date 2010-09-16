/*globals YAHOO */
XC.Test.Mixin.ChatStateNotificationEntity = new YAHOO.tool.TestCase({
  name: 'XC Chat State Notification Entity Mixin Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});

    this.arthur = this.xc.Entity.extend({
      jid: 'adent@earth.com',
      name: 'Arthur Dent'
    });
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
    delete this.arthur;
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;
    Assert.mixesIn(XC.Entity, XC.Mixin.ChatStateNotification.Entity);
  },

  testDefaultMessage: function () {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChat();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      active: {
        xpath: '/message/chatStates:active/node()',
        value: null,
        assert: function (nil, node) {
          Assert.isNotNull(node);
        }
      }
    });
  },

  testComposingMessage: function () {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChatStateComposing();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      active: {
        xpath: '/message/chatStates:composing/node()',
        value: null,
        assert: function (nil, node) {
          Assert.isNotNull(node);
        }
      }
    });
  },

  testPausedMessage: function () {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChatStatePaused();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      active: {
        xpath: '/message/chatStates:paused/node()',
        value: null,
        assert: function (nil, node) {
          Assert.isNotNull(node);
        }
      }
    });
  },

  testInactiveMessage: function () {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChatStateInactive();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      active: {
        xpath: '/message/chatStates:inactive/node()',
        value: null,
        assert: function (nil, node) {
          Assert.isNotNull(node);
        }
      }
    });
  },

  testGoneMessage: function () {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChatStateGone();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      active: {
        xpath: '/message/chatStates:gone/node()',
        value: null,
        assert: function (nil, node) {
          Assert.isNotNull(node);
        }
      }
    });
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Mixin.ChatStateNotificationEntity);
