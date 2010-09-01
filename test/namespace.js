/*global YAHOO */
XC.Test.Namespace = new YAHOO.tool.TestCase({
  name: 'Namespace Tests',

  testNamespaceExists: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isObject(XC);
  }
});

YAHOO.tool.TestRunner.add(XC.Test.Namespace);
