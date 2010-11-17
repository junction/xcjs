/*globals YAHOO */
XC.Test.Mixin.DelayedDelivery = new YAHOO.tool.TestCase({
  name: 'XC Delayed Delivery Mixin Tests',

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
    Assert.mixesIn(XC.MessageStanza, XC.Mixin.DelayedDelivery);
    Assert.mixesIn(XC.PresenceStanza, XC.Mixin.DelayedDelivery);
  },

  testCreationFromMessagePacket: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
      "<message from='coven@macbeth.shakespeare.lit/secondwitch'\
                to='macbeth@shakespeare.lit/laptop'\
                type='groupchat'>\
         <body>\
           By the pricking of my thumbs,\
           Something wicked this way comes.\
           Open, locks,\
           Whoever knocks!\
         </body>\
         <delay xmlns='urn:xmpp:delay'\
                from='coven@macbeth.shakespeare.lit'\
                stamp='2002-09-10T23:05:37Z'>\
           Offline Storage\
         </delay>\
       </message>");

    var msg = this.xc.MessageStanza.extend({
      packet: packet
    });
    Assert.areEqual('coven@macbeth.shakespeare.lit', msg.delay.from);
    Assert.areEqual('2002-09-10T23:05:37Z', msg.delay.stamp);
    Assert.areEqual('Offline Storage', msg.delay.text.replace(/^\s+/, '').replace(/\s+$/, ''));
  },

  testCreationFromPresencePacket: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
      "<presence from='juliet@capulet.com/balcony' to='romeo@montague.net'>\
         <status>anon!</status>\
         <show>xa</show>\
         <priority>1</priority>\
         <delay xmlns='urn:xmpp:delay'\
                from='juliet@capulet.com/balcony'\
                stamp='2002-09-10T23:41:07Z'/>\
       </presence>");

    var msg = this.xc.MessageStanza.extend({
      packet: packet
    });
    Assert.areEqual('juliet@capulet.com/balcony', msg.delay.from);
    Assert.areEqual('2002-09-10T23:41:07Z', msg.delay.stamp);
    Assert.areEqual('', msg.delay.text);
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Mixin.DelayedDelivery);
