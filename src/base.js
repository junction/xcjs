/**
 * @namespace
 * Object class for XC. All objects inherit from this one.
 */
XC.Base = {

  /**
   * Iterates over all arguments, adding their own
   * properties to the reciever.
   *
   * @example
   *   obj.mixin({param: value});
   *
   * @returns {XC.Base} the reciever
   *
   * @see XC.Base.extend
   */
  mixin: function () {
    var len = arguments.length,
      empty = function () {},
      obj, val, fn, cur;

    for (var i = 0; i < len; i++) {
      obj = arguments[i];
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          val = obj[prop];
          cur = this[prop];

          if (XC.isFunction(val) && val._xcInferior && cur)
            continue;

          if (XC.isFunction(val) && val._xcAround) {
            fn = (cur && XC.isFunction(cur)) ? cur : empty;
            val = val.curry(fn);
          }


          this[prop] = val;
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
