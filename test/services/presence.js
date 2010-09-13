/*globals YAHOO */
XC.Test.Presence = new YAHOO.tool.TestCase({
  name: 'XC Presence Service Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});

    this.Presence = this.xc.Presence;
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;
    Assert.mixesIn(this.Presence, XC.Mixin.HandlerRegistration);
  },

  testSend: function () {
    var Assert = YAHOO.util.Assert;

    this.Presence.send(XC.Presence.SHOW.AWAY, 'Out to lunch', 5);

    // <presence>
    //   <show>away</show>
    //   <status>Out to lunch</status>
    //   <priority>5</priority>
    // </presence>
    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      show: {
        xpath: '/presence/show/text()',
        value: 'away'
      },
      status: {
        xpath: '/presence/status/text()',
        value: 'Out to lunch'
      },
      priority: {
        xpath: '/presence/priority/text()',
        value: '5'
      }
    });

    // <presence/>
    this.Presence.send();
    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      type: {
        xpath: '/presence/@type',
        value: undefined
      },
      noChildren: {
        xpath: '/presence/*',
        value: undefined
      }
    });
  },

  testUnavailable: function () {
    var Assert = YAHOO.util.Assert;

    // <presence type="unavailable"/>
    this.Presence.sendUnavailable();
    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      type: {
        xpath: '/presence/@type',
        value: 'unavailable'
      }
    });

    // <presence type="unavailable">
    //   <status>Gone home.</status>
    // </presence>
    this.Presence.sendUnavailable('Gone home.');
    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      type: {
        xpath: '/presence/@type',
        value: 'unavailable'
      },
      status: {
        xpath: '/presence/status/text()',
        value: 'Gone home.'
      }
    });
  },

  testOnSubscribe: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="romeo@example.com" \
                     to="' + this.conn.jid() + '" \
                     type="subscribe"/>'
        ), that = this, fired = false;

    this.xc.Presence.registerHandler('onSubscribe', function (request) {
      fired = true;
      Assert.isObject(request);
      Assert.isFunction(request.accept);
      Assert.isFunction(request.deny);
      Assert.areEqual(request.to, that.conn.jid());
      Assert.areEqual(request.from, 'romeo@example.com');
      Assert.areEqual(request.type, 'subscribe');
      Assert.areEqual(request.stanza, packet);

      // Test 'accept'
      request.accept();
      Assert.XPathTests(that.conn.getLastStanzaXML(), {
        type: {
          xpath: '/presence/@type',
          value: 'subscribed'
        },
        to: {
          xpath: '/presence/@to',
          value: 'romeo@example.com'
        },
        noChildren: {
          xpath: '/presence/*',
          value: undefined
        }
      });

      // Test 'deny'
      request.deny();
      Assert.XPathTests(that.conn.getLastStanzaXML(), {
        type: {
          xpath: '/presence/@type',
          value: 'unsubscribed'
        },
        to: {
          xpath: '/presence/@to',
          value: 'romeo@example.com'
        },
        noChildren: {
          xpath: '/presence/*',
          value: undefined
        }
      });
    });

    this.conn.fireEvent('presence', packet);
    Assert.isTrue(fired, "Handler did not fire.");
  },

  testOnSubscribed: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="romeo@example.com" \
                     to="' + this.conn.jid() + '" \
                     type="subscribed"/>'
        ), that = this, fired = false;

    this.xc.Presence.registerHandler('onSubscribed', function (request) {
      fired = true;
      Assert.isObject(request);
      Assert.isFunction(request.accept);
      Assert.isFunction(request.deny);
      Assert.areEqual(request.to, that.conn.jid());
      Assert.areEqual(request.from, 'romeo@example.com');
      Assert.areEqual(request.type, 'subscribed');
      Assert.areEqual(request.stanza, packet);

      // Test 'accept'
      request.accept();
      Assert.XPathTests(that.conn.getLastStanzaXML(), {
        type: {
          xpath: '/presence/@type',
          value: 'subscribe'
        },
        to: {
          xpath: '/presence/@to',
          value: 'romeo@example.com'
        },
        noChildren: {
          xpath: '/presence/*',
          value: undefined
        }
      });

      // Test 'deny'
      request.deny();
      Assert.XPathTests(that.conn.getLastStanzaXML(), {
        type: {
          xpath: '/presence/@type',
          value: 'unsubscribe'
        },
        to: {
          xpath: '/presence/@to',
          value: 'romeo@example.com'
        },
        noChildren: {
          xpath: '/presence/*',
          value: undefined
        }
      });
    });

    this.conn.fireEvent('presence', packet);
    Assert.isTrue(fired, "Handler did not fire.");
  },

  testOnUnsubscribe: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="romeo@example.com" \
                     to="' + this.conn.jid() + '" \
                     type="unsubscribe"/>'
        ), that = this, fired = false;

    this.xc.Presence.registerHandler('onUnsubscribe', function (request) {
      fired = true;
      Assert.isObject(request);
      Assert.isFunction(request.accept);
      Assert.isFunction(request.deny);
      Assert.areEqual(request.to, that.conn.jid());
      Assert.areEqual(request.from, 'romeo@example.com');
      Assert.areEqual(request.type, 'unsubscribe');
      Assert.areEqual(request.stanza, packet);

      // Test 'accept'
      request.accept();
      Assert.XPathTests(that.conn.getLastStanzaXML(), {
        type: {
          xpath: '/presence/@type',
          value: 'unsubscribed'
        },
        to: {
          xpath: '/presence/@to',
          value: 'romeo@example.com'
        },
        noChildren: {
          xpath: '/presence/*',
          value: undefined
        }
      });

      // Test 'deny'
      request.deny();
      Assert.XPathTests(that.conn.getLastStanzaXML(), {
        type: {
          xpath: '/presence/@type',
          value: 'subscribed'
        },
        to: {
          xpath: '/presence/@to',
          value: 'romeo@example.com'
        },
        noChildren: {
          xpath: '/presence/*',
          value: undefined
        }
      });
    });

    this.conn.fireEvent('presence', packet);
    Assert.isTrue(fired, "Handler did not fire.");
  },

  testOnUnsubscribed: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="romeo@example.com" \
                     to="' + this.conn.jid() + '" \
                     type="unsubscribed"/>'
        ), that = this, fired = false;

    this.xc.Presence.registerHandler('onUnsubscribed', function (request) {
      fired = true;
      Assert.isObject(request);
      Assert.isFunction(request.accept);
      Assert.isFunction(request.deny);
      Assert.areEqual(request.to, that.conn.jid());
      Assert.areEqual(request.from, 'romeo@example.com');
      Assert.areEqual(request.type, 'unsubscribed');
      Assert.areEqual(request.stanza, packet);

      // Test 'accept'
      request.accept();
      Assert.XPathTests(that.conn.getLastStanzaXML(), {
        type: {
          xpath: '/presence/@type',
          value: 'unsubscribe'
        },
        to: {
          xpath: '/presence/@to',
          value: 'romeo@example.com'
        },
        noChildren: {
          xpath: '/presence/*',
          value: undefined
        }
      });

      // Test 'deny'
      request.deny();
      Assert.XPathTests(that.conn.getLastStanzaXML(), {
        type: {
          xpath: '/presence/@type',
          value: 'subscribe'
        },
        to: {
          xpath: '/presence/@to',
          value: 'romeo@example.com'
        },
        noChildren: {
          xpath: '/presence/*',
          value: undefined
        }
      });
    });

    this.conn.fireEvent('presence', packet);
    Assert.isTrue(fired, "Handler did not fire.");
  },

  testOnPresence: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="juliet@example.com/chamber" \
                     to="romeo@example.net/orchard"> \
             <show>chat</show> \
             <priority>1</priority> \
           </presence>'
        ), that = this;

    var fired = false;
    this.xc.Presence.registerHandler('onPresence', function (entity) {
      fired = true;
      Assert.isString(entity.jid);
      Assert.isObject(entity.presence);
      Assert.isString(entity.presence.show);
      Assert.isNumber(entity.presence.priority);

      Assert.areEqual(entity.jid, 'juliet@example.com/chamber');
      Assert.areEqual(entity.presence.show, 'chat');
      Assert.areEqual(entity.presence.priority, 1);
      Assert.areEqual(entity.presencestatus, null);
    });

    this.conn.fireEvent('presence', packet);
    Assert.isTrue(fired, "Handler did not fire.");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Presence);
