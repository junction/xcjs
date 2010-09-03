/*globals YAHOO */
XC.Test.Roster = new YAHOO.tool.TestCase({
  name: 'XC Roster Tests',

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

  testRequest: function () {
  },

  testAdd: function () {
  },

  testRemove: function () {
  },

  testUpdate: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq to="marvin@heart-of-gold.com" \
           type="result" \
           id="test"\>'
    ));

    var fail = false, win = false, that = this;
    this.marvin.rosterUpdate({
      onSuccess: function (entity) {
        win = true;
        Assert.isObject(entity);
        Assert.areEqual(entity, that.marvin);
      },

      onError: function () {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a roster update.");
    Assert.isFalse(fail, "Roster update threw an error.");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Roster);
