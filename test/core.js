/*globals YAHOO */
XC.Test.Core = new YAHOO.tool.TestCase({
  name: 'XC.Core Tests',

  testDebug: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.debug, 'XC.debug does not exist');
  },

  testLog: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.log, 'XC.log does not exist');
  },

  testWarn: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.warn, 'XC.warn does not exist');
  },

  testGroup: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.group, 'XC.group does not exist');
  },

  testGroupEnd: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.groupEnd, 'XC.groupEnd does not exist');
  },

  testIsFunction: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.isFunction, 'XC.isFunction does not exist');
    Assert.isTrue(XC.isFunction(function () {}), 'function is not a function');
    Assert.isFalse(XC.isFunction({}), 'object should not be a function');
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Core);
