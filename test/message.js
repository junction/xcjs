/*globals YAHOO */
XC.Test.Message = new YAHOO.tool.TestCase({
  name: 'XC Message Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

    this.chong = this.xc.Entity.extend({
      jid: 'chong@wandering-hippies.com',
      name: 'Chong'
    });
  },

  testSend: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="chong@wandering-hippies.com" \
           to="sokka@water-tribe.com" \
           type="result"> \
      </iq>'
    ));

    var msg = XC.Message.extend({
      to: this.chong,
      type: 'chat',
      subject: "The Cave of the Two Lovers",
      body: "Don't let the cave-in get you down... Sokka",
      thread: "Avatar",
      connection: this.xc
    });
    msg.send();

    var packet = XC.Test.Packet.extendWithXML(this.conn._data);
    
    Assert.areEqual(packet.getType(), msg.type,
                    "The expected packet type was incorrect.");
    Assert.areEqual(packet.getTo(), this.chong.jid,
                    "The expected entity to was incorrect.");

    packet = packet.getNode();
    var el = packet.getElementsByTagName('body')[0];
    Assert.areEqual(el.textContent || el.text, msg.body,
                    "The expected body was incorrect.");
    el = packet.getElementsByTagName('subject')[0];
    Assert.areEqual(el.textContent || el.text, msg.subject,
                    "The expected subject was incorrect.");
    el = packet.getElementsByTagName('thread')[0];
    Assert.areEqual(el.textContent || el.text, msg.thread,
                    "The expected thread was incorrect.");
  },

  testReply: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq from="chong@wandering-hippies.com" \
           to="sokka@water-tribe.com" \
           type="result"> \
      </iq>'
    ));

    var msg = XC.Message.extend({
      from: this.chong,
      type: 'chat',
      subject: "The Cave of the Two Lovers",
      thread: "Avatar",
      connection: this.xc
    });
    msg.reply("Big bad badger mole coming right toward me- help me guys.");

    var packet = XC.Test.Packet.extendWithXML(this.conn._data);
    
    Assert.areEqual(packet.getType(), msg.type,
                    "The expected packet type was incorrect.");
    Assert.areEqual(packet.getTo(), this.chong.jid,
                    "The expected entity to was incorrect.");

    packet = packet.getNode();

    var el = packet.getElementsByTagName('body')[0];
    Assert.areEqual(el.textContent || el.text, "Big bad badger mole coming right toward me- help me guys.",
                    "The expected body was incorrect.");
    el = packet.getElementsByTagName('subject')[0];
    Assert.areEqual(el.textContent || el.text, msg.subject,
                    "The expected subject was incorrect.");
    el = packet.getElementsByTagName('thread')[0];
    Assert.areEqual(el.textContent || el.text, msg.thread,
                    "The expected thread was incorrect.");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Message);
