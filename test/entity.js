/*globals YAHOO */
XC.Test.Base = new YAHOO.tool.TestCase({
  name: 'XC.Entity Tests',

  testIsObject: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isObject(XC.Entity);
  }
});

YAHOO.tool.TestRunner.add(XC.Test.Base);
