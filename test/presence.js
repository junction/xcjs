/*globals YAHOO */
XC.Test.Presence = new YAHOO.tool.TestCase({
  name: 'XC Presence Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testSend: function () {
  },

  testSubscribe: function () {
  },

  testUnsubscribe: function () {
  },

  testUnavailable: function () {
  },

  testApproveSubscription: function () {
  },

  testDenySubscription: function () {
  },

  testOnSubscribe: function () {
  },

  testOnSubscribed: function () {
  },

  testOnUnsubscribed: function () {
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Presence);
