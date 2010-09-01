/*globals YAHOO */
XC.Test.Disco = new YAHOO.tool.TestCase({
  name: 'XC Disco Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connection: this.conn});
    this.xc.initConnection();
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testInfo: function () {
  },

  testItems: function () {
  },

  testRootItem: function () {
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Disco);
