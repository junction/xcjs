/*global YAHOO */
XC.Test.RosterX = new YAHOO.tool.TestCase({
  name: 'XC Roster Item Exchange Mixin Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
  },

  tearDown: function () {
    delete this.xc;
    delete this.conn;
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;
    Assert.mixesIn(XC.Mixin.RosterX.Service, XC.Mixin.Discoverable);
  },

  testOnRosterItemExchange: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
      "<iq from='horatio@denmark.lit' to='hamlet@denmark.lit'>\
        <x xmlns='http://jabber.org/protocol/rosterx'>\
          <item action='add'\
                jid='rosencrantz@denmark.lit'\
                name='Rosencrantz'>\
            <group>Visitors</group>\
          </item>\
          <item action='add'\
                jid='guildenstern@denmark.lit'\
                name='Guildenstern'>\
            <group>Visitors</group>\
          </item>\
        </x>\
      </iq>");

    var ran = false;
    this.xc.Roster.registerHandler('onRosterExchangeItems',
      function (entities, from, body) {
        ran = true;
        Assert.areSame("", body);
        Assert.isArray(entities);
        Assert.areSame(2, entities.length);
        Assert.mixesIn(entities[0], XC.Mixin.RosterX.Entity);

        Assert.areSame('add', entities[0].rosterx.action);
        Assert.areSame('rosencrantz@denmark.lit', entities[0].jid);
        Assert.areSame('Rosencrantz', entities[0].rosterx.name);
        Assert.areSame('Visitors', entities[0].rosterx.groups[0]);

        Assert.areSame('add', entities[1].rosterx.action);
        Assert.areSame('guildenstern@denmark.lit', entities[1].jid);
        Assert.areSame('Guildenstern', entities[1].rosterx.name);
        Assert.areSame('Visitors', entities[1].rosterx.groups[0]);

        Assert.areSame('horatio@denmark.lit', from);
      }
    );
    this.conn.fireEvent('iq', packet);
    Assert.isTrue(ran);
  },

  testOnRosterItemExchangeMessage: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
      "<message from='horatio@denmark.lit' to='hamlet@denmark.lit'>\
         <body>Some visitors, m'lord!</body>\
         <x xmlns='http://jabber.org/protocol/rosterx'>\
           <item action='add'\
                 jid='rosencrantz@denmark.lit'\
                 name='Rosencrantz'>\
             <group>Visitors</group>\
           </item>\
           <item action='add'\
                 jid='guildenstern@denmark.lit'\
                 name='Guildenstern'>\
             <group>Visitors</group>\
           </item>\
         </x>\
       </message>");

    var ran = false;
    this.xc.Roster.registerHandler('onRosterExchangeItems',
      function (entities, from, body) {
        ran = true;
        Assert.areSame("Some visitors, m'lord!", body);
      }
    );

    this.conn.fireEvent("message", packet);
    Assert.isTrue(ran);
  },

  testAcceptRosterX: function () {
    var Assert = YAHOO.util.Assert;

    var packet = XC.Test.Packet.extendWithXML(
    "<iq from='horatio@denmark.lit' to='hamlet@denmark.lit'>\
      <x xmlns='http://jabber.org/protocol/rosterx'>\
        <item action='add'\
              jid='rosencrantz@denmark.lit'\
              name='Rosencrantz'>\
          <group>Visitors</group>\
        </item>\
        <item action='modify'\
              jid='guildenstern@denmark.lit'\
              name='Guildenstern'>\
          <group>Retinue</group>\
        </item>\
        <item action='delete'\
              jid='osric@denmark.lit'\
              name='Osric'>\
          <group>Retinue</group>\
        </item>\
      </x>\
    </iq>");

    var ran = false, that = this;
    this.xc.Roster.registerHandler('onRosterExchangeItems',
      function (entities, from, body) {
        ran = true;
        var entity, expected = [
          {
            jid: 'rosencrantz@denmark.lit',
            name: 'Rosencrantz',
            group: 'Visitors',
            action: 'add'
          },
          {
            jid: 'guildenstern@denmark.lit',
            name: 'Guildenstern',
            group: 'Retinue',
            action: 'modify'
          }
        ];

        for (var i = 0, len = expected.length; i < len; i++) {
          entity = entities[i];
          Assert.areSame(expected[i].action, entity.rosterx.action);
          Assert.isFunction(entity.acceptRosterX);

          that.conn.addResponse(XC.Test.Packet.extendWithXML(
            '<iq type="result"/>'
          ));
          entity.acceptRosterX();
          Assert.XPathTests(that.conn.getLastStanzaXML(), {
            type: {
              xpath: '/client:iq/@type',
              value: 'set'
            },
            jid: {
              xpath: '/client:iq/roster:query/roster:item/@jid',
              value: expected[i].jid
            },
            name: {
              xpath: '/client:iq/roster:query/roster:item/@name',
              value: expected[i].name
            },
            group: {
              xpath: '/client:iq/roster:query/roster:item/roster:group/text()',
              value: expected[i].group
            }
          });
        }

        entity = entities[2];
        Assert.areSame('delete', entity.rosterx.action);
        Assert.isFunction(entity.acceptRosterX);

        that.conn.addResponse(XC.Test.Packet.extendWithXML(
          '<iq type="result"/>'
        ));
        entity.acceptRosterX();
        Assert.XPathTests(that.conn.getLastStanzaXML(), {
          type: {
            xpath: '/client:iq/@type',
            value: 'set'
          },
          jid: {
            xpath: '/client:iq/roster:query/roster:item/@jid',
            value: "osric@denmark.lit"
          },
          subscription: {
            xpath: '/client:iq/roster:query/roster:item/@subscription',
            value: "remove"
          }
        });
      }
    );

    this.conn.fireEvent("iq", packet);
    Assert.isTrue(ran);
  }

});

YAHOO.tool.TestRunner.add(XC.Test.RosterX);
