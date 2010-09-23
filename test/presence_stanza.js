/*globals YAHOO */
XC.Test.Presence = new YAHOO.tool.TestCase({
  name: 'XC Presence Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});

    this.chong = this.xc.Entity.extend({
      jid: 'chong@wandering-hippies.com',
      name: 'Chong'
    });
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
    delete this.chong;
  },

  testPresenceSlots: function () {
    var Assert = YAHOO.util.Assert;

    var pres = this.xc.PresenceStanza.extend({
      to: this.chong,
      show: XC.Registrar.Presence.SHOW.AWAY,
      status: 'Jivin\'',
      priority: 5,
      type: 'subscribe'
    });

    Assert.areEqual(this.chong, pres.to, 'pres.to is incorrect');
    Assert.areEqual(null, pres.from, 'pres.from is incorrect');
    Assert.areEqual('subscribe', pres.type, 'pres.from is incorrect');

    Assert.areEqual('away', pres.show, 'pres.show is incorrect');
    Assert.areEqual('Jivin\'', pres.status, 'pres.status is incorrect');
    Assert.areEqual(5, pres.priority, 'pres.priority is incorrect');
  },

  testPresenceWithPacket: function () {
    var Assert = YAHOO.util.Assert;
    var xml = '<presence to="' + this.conn.jid() + '"\
                         from="' + this.chong.jid + '" type="unsubscribe">\
                 <show>chat</show>\
                 <status>Don\'t let the cave in get you down!</status>\
                 <priority>2</priority>\
               </presence>';

    var pres = this.xc.PresenceStanza.extend({
      packet: XC.Test.Packet.extendWithXML(xml)
    });

    Assert.areEqual('unsubscribe', pres.type, 'pres type is wrong');
    Assert.areEqual('chat', pres.show, 'pres show is incorrect');
    Assert.areEqual('Don\'t let the cave in get you down!', pres.status,
                    'pres status is incorrect');
    Assert.areEqual(2, pres.priority, 'pres priority is incorrect');
    Assert.areEqual(this.conn.jid(), pres.to.jid, 'pres to should be an XC.Entity');
    Assert.areEqual(this.chong.jid, pres.from.jid, 'pres from should be an XC.Entity');
  },

  testToPresenceStanza: function () {
    var Assert = YAHOO.util.Assert;

    var pres = this.xc.PresenceStanza.extend();

    Assert.isFunction(pres.toStanzaXML,
                      'XC.Presence.toStanzaXML should be a function.');
    Assert.isObject(pres.toStanzaXML(),
                    'XC.Presence.toStanzaXML shoudl return an Object.');
  },

  testXML: function () {
    var Assert = YAHOO.util.Assert;

    var pres = this.xc.PresenceStanza.extend();

    Assert.XPathTests(pres.toStanzaXML().convertToString(), {
      nothing: {
        value: null,
        xpath: '/presence/node()',
        assert: function (nil, node, msg) {
          Assert.isNotNull(node, msg);
        }
      }
    });

    pres = this.xc.PresenceStanza.extend({
      to: this.chong,
      type: 'unavailable'
    });

    Assert.XPathTests(pres.toStanzaXML().convertToString(), {
      to: {
        value: this.chong.jid,
        xpath: '/presence/@to'
      },
      type: {
        value: 'unavailable',
        xpath: '/presence/@type'
      }
    });

    pres = this.xc.PresenceStanza.extend({
      show: "away",
      status: "Frolicking",
      priority: 5
    });

    Assert.XPathTests(pres.toStanzaXML().convertToString(), {
      show: {
        value: 'away',
        xpath: '/presence/show/text()'
      },
      status: {
        value: 'Frolicking',
        xpath: '/presence/status/text()'
      },
      priority: {
        value: '5',
        xpath: '/presence/priority/text()'
      }
    });
  },

  testAccept: function () {
    var Assert = YAHOO.util.Assert;

    var pres = this.xc.PresenceStanza.extend({
      from: this.chong,
      type: 'subscribe'
    });
    pres.accept();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/presence/@to',
        value: pres.from.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'subscribed'
      }
    });

    pres.type = 'subscribed';
    pres.accept();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/presence/@to',
        value: pres.from.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'subscribe'
      }
    });

    pres.type = 'unsubscribe';
    pres.accept();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/presence/@to',
        value: pres.from.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'unsubscribed'
      }
    });

    pres.type = 'unsubscribed';
    pres.accept();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/presence/@to',
        value: pres.from.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'unsubscribe'
      }
    });
  },

  testDeny: function () {
    var Assert = YAHOO.util.Assert;

    var pres = this.xc.PresenceStanza.extend({
      from: this.chong,
      type: 'subscribe'
    });
    pres.deny();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/presence/@to',
        value: pres.from.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'unsubscribed'
      }
    });

    pres.type = 'subscribed';
    pres.deny();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/presence/@to',
        value: pres.from.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'unsubscribe'
      }
    });

    pres.type = 'unsubscribe';
    pres.deny();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/presence/@to',
        value: pres.from.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'subscribed'
      }
    });

    pres.type = 'unsubscribed';
    pres.deny();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/presence/@to',
        value: pres.from.jid
      },
      type: {
        xpath: '/presence/@type',
        value: 'subscribe'
      }
    });
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Presence);
