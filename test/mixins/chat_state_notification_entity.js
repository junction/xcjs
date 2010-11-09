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
        xpath: '/message/chatStates:active',
        value: null,
        assert: function (val, nodeVal, message, node) {
          Assert.isObject(node, arguments[2]);
        }
      }
    });
  },

  testComposingMessage: function () {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChatStateComposing();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      active: {
        xpath: '/message/chatStates:composing',
        value: null,
        assert: function (val, nodeVal, message, node) {
          Assert.isObject(node, arguments[2]);
        }
      }
    });
  },

  testPausedMessage: function () {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChatStatePaused();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      active: {
        xpath: '/message/chatStates:paused',
        value: null,
        assert: function (val, nodeVal, message, node) {
          Assert.isObject(node, arguments[2]);
        }
      }
    });
  },

  testInactiveMessage: function () {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChatStateInactive();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      active: {
        xpath: '/message/chatStates:inactive',
        value: null,
        assert: function (val, nodeVal, message, node) {
          Assert.isObject(node, arguments[2]);
        }
      }
    });
  },

  testGoneMessage: function () {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChatStateGone();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      active: {
        xpath: '/message/chatStates:gone',
        value: null,
        assert: function (val, nodeVal, message, node) {
          Assert.isObject(node, arguments[2]);
        }
      }
    });
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Mixin.ChatStateNotificationEntity);
