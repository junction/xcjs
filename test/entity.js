/*globals YAHOO */
XC.Test.Base = new YAHOO.tool.TestCase({
  name: 'XC.Entity Tests',

  testIsObject: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isObject(XC.Entity);
  },

  testMixins: function () {
    var Assert = YAHOO.util.Assert;
    Assert.mixesIn(XC.Entity, XC.Mixin.JID,
                              XC.Mixin.Presence,
                              XC.Mixin.Roster,
                              XC.Mixin.Chat,
                              XC.Mixin.Disco);
  }
});

YAHOO.tool.TestRunner.add(XC.Test.Base);
