/*globals YAHOO */
XC.Test.Roster = new YAHOO.tool.TestCase({
  name: 'XC Roster Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

    this.Roster = this.xc.Roster;
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
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq to="marvin@heart-of-gold.com" \
           type="result" \
           id="test"> \
         <item jid="zaphod@heart-of-gold.com" \
               name="Zaphod"> \
           <group>Human</group> \
         </item> \
         <item jid="ford@betelguice.net" \
               name="Ford Prefect"> \
           <group>Human</group> \
         </item> \
      </iq>'
    ));

    var fail = false, win = false;
    this.Roster.request({
      onSuccess: function (entities) {
        win = true;
        Assert.areEqual(entities[0].jid, "ford@betelguice.net",
                        "The entity's jid is not what was expected.");
        Assert.areEqual(entities[0].name, "Ford Prefect",
                        "The entity's name is not what was expected.");
        Assert.areEqual(entities[0].groups[0], "Human",
                        "The entity's group is not what was expected.");

        Assert.areEqual(entities[1].jid, "zaphod@heart-of-gold.com",
                        "The entity's jid is not what was expected.");
        Assert.areEqual(entities[1].name, "Zaphod",
                        "The entity's name is not what was expected.");
        Assert.areEqual(entities[1].groups[0], "Human",
                        "The entity's group is not what was expected.");
      },

      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(win, "Was not successful in doing a roster request.");
    Assert.isFalse(fail, "Roster request threw an error.");
  },

  testAdd: function () {
  },

  testRemove: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
      '<iq to="marvin@heart-of-gold.com" \
           type="result" \
           id="test"\>'
    ));
    
    var fail = false, win = false, that = this;
    this.marvin.rosterRemove({
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

    Assert.isTrue(win, "Was not successful in doing a roster remove.");
    Assert.isFalse(fail, "Roster remove threw an error.");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Roster);
