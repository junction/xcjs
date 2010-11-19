/*globals YAHOO */
XC.Test.Connection = new YAHOO.tool.TestCase({
  name: 'XC Connection Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testGetJID: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isFunction(this.xc.getJID,
                      'Connection does not supply getJID function.');
    Assert.areSame('mock@example.com', this.xc.getJID(),
                   'Connection JID is wrong.');
  },

  testDebugDisabled: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFalse(this.xc.DEBUG_PACKETS, 'this should be disabled unless testing');
  },

  testServicesInitialized: function () {
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

  /**
   * packet interface looks like:
   * {
   *   getNode: {Function} returns {Element}
   *   getType: {Function} returns {String}
   *   getFrom: {Function} returns {String}
   *   getTo:  {Function} returns {String}
   * }
   */
  testPacketInterface: function() {
    var Assert = YAHOO.util.Assert;

    this.xc.DEBUG_PACKETS = true;
    Assert.throws(XC.Error, function() {
                    this.conn.fireEvent('message', {});
                  }.bind(this), 'packet must conform to the interface above');

    Assert.isUndefined(this.conn.fireEvent('message', {
                                             getType: function() { return 'test type needs to be a string'; },
                                             getFrom: function() { return 'from needs to be a string'; },
                                             getTo: function() { return 'to also needs to be a string'; },
                                             getNode: function() { return document.createElement('message'); }
                                           }),'this packet should have a valid interface');
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

  testHandlerFiringContext: function() {
    var Assert = YAHOO.util.Assert;

    var handlerContext;
    var handler = function (packet) { handlerContext = this; };
    var id = this.xc.registerStanzaHandler({element: 'message'}, handler);

    // test this.xc is handlerContext
    var xml = '<message from="sender@source.org" to="me@dest.com" type="get"></message>';
    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));
    Assert.areSame(window, handlerContext, 'handlerContext should equal window');

    this.xc.unregisterStanzaHandler(id);
    handlerContext = null;

    var otherContext = {};
    id = this.xc.registerStanzaHandler({element: 'message'}, handler, otherContext);
    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));
    Assert.areSame(otherContext, handlerContext, 'handlerContext should equal otherContext');
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

    var pkt = XC.Test.Packet.extendWithXML(xml);
    this.conn.fireEvent('message', pkt);
    Assert.isTrue(handlerAFired, 'handlerA did not fire');
    Assert.isTrue(handlerBFired, 'handlerB did not fire');
    Assert.isTrue(handlerCFired, 'handlerC did not fire');
    Assert.isTrue(handlerDFired, 'handlerD did not fire');
    Assert.isTrue(handlerEFired, 'handlerE did not fire');
    Assert.isTrue(handlerFFired, 'handlerF did not fire');
  },

  testHandlerNotRegisteredToPrototype: function() {
    var Assert = YAHOO.util.Assert;

    var callCount = 0;
    var id = this.xc.registerStanzaHandler({element: 'message'}, function() {
                                             callCount++;
                                           });

    var xml = '<message from="sender@source.org" to="me@dest.com" type="get" xmlns="xcjs:top:level" id="test-1">'
                + '<child xmlns="xcjs:child:level"></child>'
                + '</message>';
    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));

    delete this.xc;

    this.xc = XC.Connection.extend({connectionAdapter: this.conn});

    var id2 = this.xc.registerStanzaHandler({element: 'message'}, function() {
                                              callCount++;
                                            });

    this.conn.fireEvent('message',XC.Test.Packet.extendWithXML(xml));
    Assert.areEqual(2,callCount, 'handlers should not be added to connection prototype');
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
