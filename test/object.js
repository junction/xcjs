/*globals YAHOO */
XC.Test.Base = new YAHOO.tool.TestCase({
  name: 'XC.Base Tests',

  testIsFunction: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isFunction(XC.Base.isFunction, 'XC.Base.isFunction does not exist');

    Assert.isTrue(XC.Base.isFunction(function () {}), 'function is not a function');
    Assert.isFalse(XC.Base.isFunction({}), 'object should not be a function');
  },

  testExtend: function () {
    var Assert = YAHOO.util.Assert;

    var tmp = XC.Base.extend();
    Assert.isObject(tmp);
    Assert.isFunction(tmp.extend);
    Assert.areNotSame(tmp, XC.Base);

    var tmp2 = tmp.extend({foo: 'foo'});
    Assert.areSame('foo', tmp2.foo);
    Assert.isUndefined(tmp.foo);
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;

    var tmp = XC.Base.extend();
    tmp.mixin({foo: 'foo'});
    Assert.areSame('foo', tmp.foo);
  },

  testMixinAround: function () {
    var Assert = YAHOO.util.Assert;

    var orig = XC.Base.extend({
      doStuff: function () {
        return 'a';
      }
    });

    var secondary = orig.extend({
      doStuff: function ($orig) {
        return $orig.call(this) + 'b';
      }.around()
    });

    var tertiary = secondary.extend({
      doStuff: function ($orig) {
        return $orig.call(this) + 'c';
      }.around()
    });

    var quartenary = secondary.extend({
      doStuff: function () {
        return arguments.length;
      }
    });

    // test orig is the same
    Assert.areSame('a', orig.doStuff(), "orig doStuff should return 1 'a'");

    // test order after inital around
    Assert.areSame('ab', secondary.doStuff(), "secondary doStuff should return 'ab'");

    // test around after an around
    Assert.areSame('abc', tertiary.doStuff(), "tertiary doStuff should return 'abc'");

    // test overloading w/o around after around
    Assert.areSame(0, quartenary.doStuff(), "quartenary doStuff should return 0");
  }
});

YAHOO.tool.TestRunner.add(XC.Test.Base);
