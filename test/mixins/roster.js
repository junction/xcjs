/*globals YAHOO */
XC.Test.Mixin.Roster = new YAHOO.tool.TestCase({
  name: 'XC Roster Mixin Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

    this.marvin = XC.Entity.extend({
      name: "Marvin",
      jid: "marvin@heart-of-gold.com",
      connection: this.xc
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
           id="test"\>'
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

    var response = XC.Test.Packet.extendWithXML(this.conn._data);

    Assert.areEqual(response.getType(), 'set');
    response = response.getNode();

    Assert.areEqual(response.firstChild.getAttribute('xmlns'), 'jabber:iq:roster');

    var item = response.firstChild.firstChild;
    Assert.areEqual(item.getAttribute('jid'), 'marvin@heart-of-gold.com');
    Assert.areEqual(item.getAttribute('subscription'), 'remove');

    Assert.isTrue(win, "Was not successful in doing a roster update.");
    Assert.isFalse(fail, "Roster update threw an error.");
  },

  testUpdate: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq to="marvin@heart-of-gold.com" \
           type="result" \
           id="test"\>'
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

    var response = XC.Test.Packet.extendWithXML(this.conn._data);

    Assert.areEqual(response.getType(), 'set');
    response = response.getNode();

    Assert.areEqual(response.firstChild.getAttribute('xmlns'), 'jabber:iq:roster');

    var item = response.firstChild.firstChild;
    Assert.areEqual(item.getAttribute('jid'), 'marvin@heart-of-gold.com');
    Assert.areEqual(item.getAttribute('name'), 'Marvin');

    Assert.isTrue(win, "Was not successful in doing a roster remove.");
    Assert.isFalse(fail, "Roster remove threw an error.");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Mixin.Roster);
