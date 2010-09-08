/**
 * Utility library for mixing in common functionality to
 * native Javascript objects
 */

/*
 * Function.prototype
 */
XC.Base.mixin.call(Function.prototype, /** @lends Function.prototype */ {
  around: function() {
    this._isAround = true;
    return this;
  },

  curry: function() {
    if (!arguments.length) return this;
    var curriedArgs = Array.from(arguments),
      fn = this;
    return function() { return fn.apply(this,curriedArgs.concat(Array.from(arguments))); };
  }
});

/*
 * Array
 */
XC.Base.mixin.call(Array, /** @lends Array */ {
  from: function(iterable) {
    var ret = [];
    for(var i=0,len=iterable.length; i<len; i++) ret.push(iterable[i]);
    return ret;
  }
});
