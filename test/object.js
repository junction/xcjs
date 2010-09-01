/*globals YAHOO */
XC.Test.Base = new YAHOO.tool.TestCase({
  name: 'XC.Object Tests',

  testExtend: function () {
    var Assert = YAHOO.util.Assert;

    var tmp = XC.Object.extend();
    Assert.isObject(tmp);
    Assert.isFunction(tmp.extend);
    Assert.areNotSame(tmp, XC.Object);

    var tmp2 = tmp.extend({foo: 'foo'});
    Assert.areSame('foo', tmp2.foo);
    Assert.isUndefined(tmp.foo);
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;

    var tmp = XC.Object.extend();
    tmp.mixin({foo: 'foo'});
    Assert.areSame('foo', tmp.foo);
  }
});

YAHOO.tool.TestRunner.add(XC.Test.Base);
