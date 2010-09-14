/*globals YAHOO */
XC.Test.Message = new YAHOO.tool.TestCase({
  name: 'XC Message Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});

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
      subject: "The Cave of the Two Lovers",
      body: "Don't let the cave-in get you down... Sokka",
      thread: "Avatar"
    });

    Assert.areEqual('chat', msg.type, 'msg.chat is incorrect');
    Assert.areEqual(this.chong, msg.to, 'msg.to is incorrect');
    Assert.areEqual("The Cave of the Two Lovers", msg.subject, 'msg.subject is incorrect');
    Assert.areEqual("Don't let the cave-in get you down... Sokka", msg.body, 'msg.body is incorrect');
    Assert.areEqual("Avatar", msg.thread, 'msg.thread is incorrect');
  },

  testMessageWithPacket: function() {
    var Assert = YAHOO.util.Assert;
    var xml = '<message to="' + this.conn.jid() + '" from="' + this.chong.jid + '" type="chat">'
                + '<body>dont cry for me, Im already dead</body>'
                + '<subject>Puke-a-hontas</subject>'
                + '<thread>A star is Burns</thread>'
                + '</message>';

    var msg = XC.Message.extend({
      packet: XC.Test.Packet.extendWithXML(xml)
    });

    Assert.areEqual('chat', msg.type, 'msg type is wrong');
    Assert.areEqual('dont cry for me, Im already dead', msg.body, 'msg body is incorrect');
    Assert.areEqual('Puke-a-hontas', msg.subject, 'msg subject is incorrect');
    Assert.areEqual('A star is Burns', msg.thread, 'msg thread is incorrect');
    Assert.areEqual(this.conn.jid(), msg.to.jid, 'msg to should be an XC.Entity');
    Assert.areEqual(this.chong.jid, msg.from.jid, 'msg from should be an XC.Entity');
  },

  testToMessageStanza: function() {
    var Assert = YAHOO.util.Assert;

    var msg = XC.Message.extend({
      to: this.chong,
      subject: "The Cave of the Two Lovers",
      body: "Don't let the cave-in get you down... Sokka",
      thread: "Avatar"
    });

    Assert.isFunction(msg.toStanzaXML, 'XC.Message.toStanzaXML should be a function.');
    Assert.isObject(msg.toStanzaXML(), 'XC.Message.toStanzaXML shoudl return an Object.');
  },

  testXML: function () {
    var Assert = YAHOO.util.Assert;

    var msg = XC.Message.extend({
      to: this.chong,
      subject: "The Cave of the Two Lovers",
      body: "Don't let the cave-in get you down... Sokka",
      thread: "Avatar"
    });

    Assert.isXMPPMessage(msg.toStanzaXML().convertToString(),
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
      body: "No subject and no thread"
    });

    Assert.isXMPPMessage(msg.toStanzaXML().convertToString(),
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
      body: "message with ID",
      id: 'message-1'
    });

    Assert.isXMPPMessage(msg.toStanzaXML().convertToString(),
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
      subject: "The Cave of the Two Lovers",
      thread: "Avatar"
    });
    msg.reply("Badger moles coming toward me, come on guys, help me out.");

    Assert.isXMPPMessage(this.conn.getLastStanzaXML(),
                         this.chong.jid, 'chat', {
      body: {
        xpath: '/message/body/text()',
        value: "Badger moles coming toward me, come on guys, help me out."
      },
      subject: {
        xpath: '/message/subject/text()',
        value: msg.subject
      },
      thread: {
        xpath: '/message/thread/text()',
        value: msg.thread
      }
    });
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Message);
