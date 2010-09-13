/*globals YAHOO */
XC.Test.Mixin.Roster = new YAHOO.tool.TestCase({
  name: 'XC Roster Mixin Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

    this.marvin = XC.Entity.extend({
      jid: "marvin@heart-of-gold.com",
      connection: this.xc,
      roster: {
        name: "Marvin"
      }
    });
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testRemove: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq to="marvin@heart-of-gold.com" \
           type="result" \
           id="test"/>'
    ));

    var fail = false, win = false, that = this;
    this.marvin.removeRosterItem({
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity);
        Assert.areEqual(entity, that.marvin);
      },

      onError: function () {
        fail = true;
      }
    });

    Assert.XPathTests(this.conn._data, {
      Set: {
        xpath: '/iq/@type',
        value: 'set'
      },
      itemJID: {
        xpath: '/iq/roster:query/roster:item/@jid',
        value: 'marvin@heart-of-gold.com'
      },
      itemName: {
        xpath: '/iq/roster:query/roster:item/@subscription',
        value: 'remove'
      }
    });

    Assert.isTrue(win, "Was not successful in doing a roster update.");
    Assert.isFalse(fail, "Roster update threw an error.");
  },

  testUpdate: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq to="marvin@heart-of-gold.com" \
           type="result" \
           id="test"/>'
    ));

    var fail = false, win = false, that = this;
    this.marvin.setRosterItem({
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity);
        Assert.areEqual(entity, that.marvin);
      },

      onError: function () {
        fail = true;
      }
    });

    Assert.XPathTests(this.conn._data, {
      Set: {
        xpath: '/iq/@type',
        value: 'set'
      },
      itemJID: {
        xpath: '/iq/roster:query/roster:item/@jid',
        value: 'marvin@heart-of-gold.com'
      },
      itemName: {
        xpath: '/iq/roster:query/roster:item/@name',
        value: 'Marvin'
      }
    });

    Assert.isTrue(win, "Was not successful in doing a roster remove.");
    Assert.isFalse(fail, "Roster remove threw an error.");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Mixin.Roster);
