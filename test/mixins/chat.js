/*globals YAHOO */
XC.Test.Chat = new YAHOO.tool.TestCase({
  name: 'XC Chat Entity Mixin Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});

    this.arthur = this.xc.Entity.extend({
      jid: 'adent@earth.com',
      name: 'Arthur Dent'
    });
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
    delete this.arthur;
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isObject(XC.Mixin.Chat, '');

    var tmp = XC.Base.extend(XC.Mixin.Chat);

    Assert.isFunction(tmp.sendChat, 'sendChat is not a function');
  },

  testSendChat: function() {
    var Assert = YAHOO.util.Assert;

    this.arthur.sendChat("Pardon me for breathing, which I never do anyway so I don't know why I bother to say it, oh God I'm so depressed. Here's another one of those self-satisfied doors. Life! Don't talk to me about life.", "Doors", "HHGTTG", '42');

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      type: {
        xpath: '/message/@type',
        value: 'chat'
      },
      to: {
        xpath: '/message/@to',
        value: this.arthur.jid
      },
      body: {
        xpath: '/message/body/text()',
        value: "Pardon me for breathing, which I never do anyway so I don't know why I bother to say it, oh God I'm so depressed. Here's another one of those self-satisfied doors. Life! Don't talk to me about life."
      },
      subject: {
        xpath: '/message/subject/text()',
        value: 'Doors'
      },
      thread: {
        xpath: '/message/thread/text()',
        value: 'HHGTTG'
      },
      id: {
        xpath: '/message/@id',
        value: '42'
      }
    });
  }
});

YAHOO.tool.TestRunner.add(XC.Test.Chat);
