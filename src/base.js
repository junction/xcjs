/**
 * Object class for XC. All objects inherit from this one.
 * @namespace
 */
XC.Base = {

  isFunction: function(o) { return (typeof o === "function"); },

  /**
   * Iterates over all arguments, adding their own
   * properties to the reciever.
   *
   * @example
   * obj.mixin({param: value});
   *
   * @returns {XC.Base} the reciever
   *
   * @see XC.Base.extend
   */
  mixin: function () {
    var len = arguments.length,
      val, cur;
    for (var i = 0; i < len; i++) {
      for (var k in arguments[i]) {
        if (arguments[i].hasOwnProperty(k)) {
          val = arguments[i][k];
          cur = this[k];

          if (XC.Base.isFunction(val)
              && XC.Base.isFunction(cur)
              && val._isAround) {
            val = val.curry(cur);
          }

          this[k] = val;
        }
      }
    }
    return this;
  },

  /**
   * Creates a new object which extends the current object.
   * Any arguments are mixed into the new object as if {@link XC.Base.mixin}
   * was called on the new object with remaining args.
   *
   * @example
   * var obj = XC.Base.extend({param: value});
   *
   * @returns {XC.Base} The new object.
   *
   * @see XC.Base.mixin
   */
  extend: function () {
    var F = function () {},
        rc;
    F.prototype = this;
    rc = new F();
    rc.mixin.apply(rc, arguments);

    if (rc.init && rc.init.constructor === Function) {
      rc.init.call(rc);
    }

    return rc;
  }

};
