/*globals YAHOO */
XC.Test.ChatRecipient = new YAHOO.tool.TestCase({
  name: 'XC.Mixin.ChatRecipient Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isObject(XC.Mixins.ChatRecipient, '');

    var tmp = XC.Base.extend(XC.Mixins.ChatRecipient);

    Assert.isFunction(tmp.sendChat, 'sendChat is not a function');
  },

  testSendChat: function() {

  }
});

YAHOO.tool.TestRunner.add(XC.Test.Base);
