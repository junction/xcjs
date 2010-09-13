/*globals YAHOO */
XC.Test.Chat = new YAHOO.tool.TestCase({
  name: 'XC Chat Tests',

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

    Assert.isObject(XC.Service.Chat, "Chat is not available.");
    Assert.areSame(this.xc, this.xc.Chat.connection, 'connection and service connection are not the same');
    Assert.mixesIn(this.xc.Chat, XC.Mixin.HandlerRegistration);
  },

  testOnMessage: function () {
    var Assert = YAHOO.util.Assert;
    var xml = '<message to="' + this.conn.jid() + '" from="barney@moestavern.net" type="chat">'
                + '<body>dont cry for me, Im already dead</body>'
                + '</message>';

    var xcMessage,
      fired;
    this.xc.Chat.registerHandler('onMessage', function() {
                                   xcMessage = arguments[0];
                                   fired = true;
                                 });

    this.conn.fireEvent('message', XC.Test.Packet.extendWithXML(xml));

    Assert.isTrue(fired, 'callback did not fire');
    Assert.isObject(xcMessage, 'xcMessage is not an object');
  }
});

YAHOO.tool.TestRunner.add(XC.Test.Chat);
