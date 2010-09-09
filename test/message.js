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

  tearDown: function() {
    delete this.conn;
    delete this.xc;
    delete this.chong;
  },

  testMessageSlots: function() {
    var Assert = YAHOO.util.Assert;

    var msg = XC.Message.extend({
      to: this.chong,
      type: 'chat',
      subject: "The Cave of the Two Lovers",
      body: "Don't let the cave-in get you down... Sokka",
      thread: "Avatar",
      connection: this.xc
    });

    Assert.areEqual('chat', msg.type, 'msg.chat is incorrect');
    Assert.areEqual(this.chong, msg.to, 'msg.to is incorrect');
    Assert.areEqual("The Cave of the Two Lovers", msg.subject, 'msg.subject is incorrect');
    Assert.areEqual("Don't let the cave-in get you down... Sokka", msg.body, 'msg.body is incorrect');
    Assert.areEqual("Avatar", msg.thread, 'msg.thread is incorrect');
  },

  testToXML: function() {
    var Assert = YAHOO.util.Assert;

    var msg = XC.Message.extend({
      to: this.chong,
      type: 'chat',
      subject: "The Cave of the Two Lovers",
      body: "Don't let the cave-in get you down... Sokka",
      thread: "Avatar",
      connection: this.xc
    });

    Assert.isFunction(msg.toXML, 'XC.Message.toXML should be a function');
    Assert.isString(msg.toXML(), 'XC.Message.toXML shoudl return a string');
  },

  testSend: function () {
    var Assert = YAHOO.util.Assert;

    var msg = XC.Message.extend({
      to: this.chong,
      type: 'chat',
      subject: "The Cave of the Two Lovers",
      body: "Don't let the cave-in get you down... Sokka",
      thread: "Avatar",
      connection: this.xc
    });
    msg.send();

    Assert.isXMPPMessage(this.conn.getLastStanzaXML(),
                        this.chong.jid,
                        'chat',
                        {
                          subject: {
                            value: msg.subject,
                            xpath: '/message/subject/text()'
                          },
                          body: {
                            value: msg.body,
                            xpath: '/message/body/text()'
                          },
                          thread: {
                            value: msg.thread,
                            xpath: '/message/thread/text()'
                          }
                        });

    msg = XC.Message.extend({
      to: this.chong,
      type: 'chat',
      body: "No subject and no thread",
      connection: this.xc
    });
    msg.send();

    Assert.isXMPPMessage(this.conn.getLastStanzaXML(),
                        this.chong.jid,
                        'chat',
                        {
                          subject: {
                            value: undefined,
                            xpath: '/message/subject/text()'
                          },
                          body: {
                            value: msg.body,
                            xpath: '/message/body/text()'
                          },
                          thread: {
                            value: undefined,
                            xpath: '/message/thread/text()'
                          }
                        });

    msg = XC.Message.extend({
      to: this.chong,
      type: 'chat',
      body: "message with ID",
      connection: this.xc
    });
    msg.send("message-1");

    Assert.isXMPPMessage(this.conn.getLastStanzaXML(),
                        this.chong.jid,
                        'chat',
                        {
                          id: {
                            value: msg.id,
                            xpath: '/message/@id'
                          }
                        });

  },

  testReply: function () {
    var Assert = YAHOO.util.Assert;

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
