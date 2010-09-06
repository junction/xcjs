/*globals YAHOO */
XC.Test.Connection = new YAHOO.tool.TestCase({
  name: 'XC Connection Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testInitConnection: function() {
    var Assert = YAHOO.util.Assert;
    console.log(this.xc);
  },

  testNoJID: function () {
    var Assert = YAHOO.util.Assert,
        expectedError = new Error(),
        badAdapter = XC.Test.MockConnection.extend({
          jid: function () {
            return undefined;
          }}).init(),
        badXC = XC.Connection.extend({connectionAdapter: badAdapter});

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

  testEntity: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isObject(this.xc.Entity);

    Assert.areSame(this.xc, this.xc.Entity.connection,
                  'extended connection.Entity template has the wrong connection');
  },

  testRegisterStanzaHandler: function() {
    var Assert = YAHOO.util.Assert;

    var handler = function (packet) {};

    // test api exists
    Assert.isFunction(this.xc.registerStanzaHandler,
                      'registerStanzaHandler is not a function.');
    Assert.isFunction(this.xc.unregisterStanzaHandler,
                      'registerStanzaHandler is not a function.');

    // test register handler
    var id = this.xc.registerStanzaHandler({element: 'message'}, handler);
    Assert.isNumber(id, 'failed to register service callback');

    // test unregister handler with matches the criteria
    Assert.isTrue(this.xc.unregisterStanzaHandler(id),
                  'failed to unregister stanza handler');

    // test unregister a handler that isn't regitered
    Assert.isFalse(this.xc.unregisterStanzaHandler(id),
                   'unregister stanza handler should return false for nonexistant handler id');
  },

  testHandlerFiring: function () {
    var Assert = YAHOO.util.Assert;

    var handlerFired = false;
    var handler = function (packet) { handlerFired = true; };

    var id = this.xc.registerStanzaHandler({element: 'message'}, handler);

    // test handler fires
    var xml = '<message from="sender@source.org" to="me@dest.com" type="get"></message>';
    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));
    Assert.isTrue(handlerFired, 'handler did not fire');

    this.xc.unregisterStanzaHandler(id);

    handlerFired = false;
    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));
    Assert.isFalse(handlerFired, 'handler should not fire');

    // non matching
    this.xc.registerStanzaHandler({element: 'iq'}, handler);
    handlerFired = false;
    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));
    Assert.isFalse(handlerFired, 'handler should not fire');
  },

  testHandlerRegistrationCriteria: function() {
    var Assert = YAHOO.util.Assert;

    var handlerAFired = false,
      handlerBFired = false,
      handlerCFired = false,
      handlerDFired = false,
      handlerEFired = false,
      handlerFFired = false;

    var handlerA = function (packet) { handlerAFired = true; },
      handlerB = function (packet) { handlerBFired = true; },
      handlerC = function (packet) { handlerCFired = true; },
      handlerD = function (packet) { handlerDFired = true; },
      handlerE = function (packet) { handlerEFired = true; },
      handlerF = function (packet) { handlerFFired = true; };

    var criteriaA = { element: 'message' },
      criteriaB = { xmlns: 'xcjs:top:level' },
      criteriaC = { xmlns: 'xcjs:child:level' },
      criteriaD = { type: 'get' },
      criteriaE = { id: 'test-1' },
      criteriaF = { from: 'sender@source.org' };

    var idA = this.xc.registerStanzaHandler(criteriaA,handlerA),
      idB = this.xc.registerStanzaHandler(criteriaB,handlerB),
      idC = this.xc.registerStanzaHandler(criteriaC,handlerC),
      idD = this.xc.registerStanzaHandler(criteriaD,handlerD),
      idE = this.xc.registerStanzaHandler(criteriaE,handlerE),
      idF = this.xc.registerStanzaHandler(criteriaF,handlerF);

    var xml = '<message from="sender@source.org" to="me@dest.com" type="get" xmlns="xcjs:top:level" id="test-1">'
                + '<child xmlns="xcjs:child:level"></child>'
                + '</message>';

    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));
    Assert.isTrue(handlerAFired, 'handlerA did not fire');
    Assert.isTrue(handlerBFired, 'handlerB did not fire');
    Assert.isTrue(handlerCFired, 'handlerC did not fire');
    Assert.isTrue(handlerDFired, 'handlerD did not fire');
    Assert.isTrue(handlerEFired, 'handlerE did not fire');
    Assert.isTrue(handlerFFired, 'handlerF did not fire');
  },

  testHandlerWithMultipleCriteria: function() {
    var Assert = YAHOO.util.Assert;

    var handlerFired = false;
    var handler = function (packet) { handlerFired = true; };
    var criteria = { element: 'message', xmlns: 'xcjs:test' };

    var id = this.xc.registerStanzaHandler(criteria, handler);

    // all registered criteria must match
    var matchingXML = '<message from="sender@source.org" to="me@dest.com" xmlns="xcjs:test"></message>';
    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(matchingXML));
    Assert.isTrue(handlerFired, 'handler with multiple matching criteria did not fire');

    // if only some match the handler shouldn't fire
    var unmatchingXML = '<message from="sender@source.org" to="me@dest.com" xmlns="xcjs:badtest"></message>';
    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(unmatchingXML));
    handlerFired = false;
    Assert.isFalse(handlerFired, 'handler with some matching criteria should not fire');
  },

  testMultipleHandlers: function() {
    var Assert = YAHOO.util.Assert;

    var handlerAFired = false,
      handlerBFired = false;

    var handlerA = function (packet) { handlerAFired = true; },
      handlerB = function (packet) { handlerBFired = true; };

    var idA = this.xc.registerStanzaHandler({element: 'message'},handlerA),
      idB = this.xc.registerStanzaHandler({element: 'message'},handlerB);

    Assert.isNumber(idA, 'failed to register handlerA callback');
    Assert.isNumber(idB, 'failed to register handlerB callback');

    var xml = '<message from="sender@source.org" to="me@dest.com" type="get"></message>';

    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));
    Assert.isTrue(handlerAFired && handlerBFired,
                  'either handlerA, handlerB, or both did not fire');

    handlerAFired = handlerBFired = false;
    this.xc.unregisterStanzaHandler(idB);
    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));
    Assert.isTrue(handlerAFired, 'handler A did not fire');
    Assert.isFalse(handlerBFired, 'handler B should not fire');
  }
});

YAHOO.tool.TestRunner.add(XC.Test.Connection);
