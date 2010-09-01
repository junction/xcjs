/*globals YAHOO */
XC.Test.Connection = new YAHOO.tool.TestCase({
  name: 'XC Connection Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connection: this.conn});
    this.xc.initConnection();
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testNoJID: function () {
    var Assert = YAHOO.util.Assert,
     expectedError = new Error();

    var badAdapter = XC.Test.ConnectionMock.extend({jid: function () { 
                                                      return undefined;
                                                    }}).init(),
        badXC = XC.Connection.extend({connection: badAdapter});

    Assert.throws(XC.Error, function () { 
                    badXC.initConnection();
                  });
  },

  testGetJID: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isFunction(this.xc.getJID,
                      'Connection does not supply getJID function.');
    Assert.areSame('mock@example.com', this.xc.getJID(),
                   'Connection JID is wrong.');
  },

  testServices: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isObject(this.xc.Presence,
                    'Presence instance is not an object.');
    Assert.isObject(this.xc.Roster,
                    'Roster instance is not an object.');
    Assert.isObject(this.xc.Chat,
                    'Chat instance is not an object.');
    Assert.isObject(this.xc.Disco,
                    'Disco instance is not an object.');

  },

  testHandlers: function () {
    var Assert = YAHOO.util.Assert;

    var handlerFired = false;
    var handler = function (packet) {
      handlerFired = true;
      Assert.areSame('jill@example.com', packet.getFrom());
      Assert.areSame('jack@example.com', packet.getTo());
    };

    Assert.isFunction(this.xc.registerJIDHandler,
                      'registerJIDHandler is not a function.');

    this.xc.registerJIDHandler('jill@example.com', handler);

    var packet = XC.Test.Packet.extendWithXML('<message from="jill@example.com" to="jack@example.com"><event xmlns="http://jabber.org/protocol/pubsub#event"><items node="musings"><item id="1"></item></items></event></message>');
    this.conn.fireEvent('message', packet);
    Assert.isTrue(handlerFired, 'JID event handler was not fired.');

    Assert.isFunction(this.xc.unregisterJIDHandler,
                      'unregisterJIDHandler is not a function.');
    handlerFired = false;
    this.xc.unregisterJIDHandler('jill@example.com');
    this.conn.fireEvent('message', packet);
    Assert.isFalse(handlerFired, 'JID event handler was fired after unregister.');
  }
});

YAHOO.tool.TestRunner.add(XC.Test.Connection);
