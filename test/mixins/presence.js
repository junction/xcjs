/*globals YAHOO */
XC.Test.Presence = new YAHOO.tool.TestCase({
  name: 'XC Presence Entity Mixin Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

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

    Assert.isObject(XC.Mixin.Presence, '');

    var tmp = XC.Base.extend(XC.Mixin.Presence);

    Assert.isFunction(tmp.sendDirectedPresence, 'sendDirectedPresence is not a function');
    Assert.isFunction(tmp.sendPresenceSubscribe, 'sendPresenceSubscribe is not a function');
    Assert.isFunction(tmp.sendPresenceUnsubscribe, 'sendPresenceUnsubscribe is not a function');
    Assert.isFunction(tmp.cancelPresenceSubscription, 'cancelPresenceSubscription is not a function');
  },

  testDirectedPresence: function() {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendDirectedPresence(XC.Presence.SHOW.AWAY, 'Running away from a room full of monkeys that wrote Macbeth', 3);

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/presence/@to',
        value: this.arthur.jid
      },
      show: {
        xpath: '/presence/show/text()',
        value: 'away'
      },
      status: {
        xpath: '/presence/status/text()',
        value: 'Running away from a room full of monkeys that wrote Macbeth'
      },
      priority: {
        xpath: '/presence/priority/text()',
        value: '3'
      }
    });
  },

  testSendSubscribe: function() {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendPresenceSubscribe();

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/presence/@to',
        value: this.arthur.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'subscribe'
      }
    });
  },

  testSendUnsubscribe: function() {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendPresenceUnsubscribe();

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/presence/@to',
        value: this.arthur.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'unsubscribe'
      }
    });
  },

  testCancelSubscription: function() {
    var Assert = YAHOO.util.Assert;

    this.arthur.cancelPresenceSubscription();

    Assert.XPathTests(this.conn._data, {
      to: {
        xpath: '/presence/@to',
        value: this.arthur.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'unsubscribed'
      }
    });
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Presence);
