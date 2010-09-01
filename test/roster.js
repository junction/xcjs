/*globals YAHOO */
XC.Test.Roster = new YAHOO.tool.TestCase({
  name: 'XC Roster Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connection: this.conn});
    this.xc.initConnection();
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testAdd: function () {
  },

  testRemove: function () {
  },

  testUpdate: function () {
  },

  testRequest: function () {
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Roster);
