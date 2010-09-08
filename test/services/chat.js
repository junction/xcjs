/*globals YAHOO */
XC.Test.Chat = new YAHOO.tool.TestCase({
  name: 'XC Chat Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testOnMessage: function () {
  },

  testSend: function () {
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Chat);
