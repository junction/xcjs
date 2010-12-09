/**
 * @namespace
 * <p>Base object for XC. All other objects inherit from this one.
 * This provides object inheritance much like Douglas Crockford's
 * <a href="http://javascript.crockford.com/prototypal.html">Prototypal
 * Inheritance in JavaScript</a> with a few modifications of our own.</p>
 *
 * <p>This framework uses Object templates rather than classes to provide
 * inheritance.</p>
 */
XC.Base = {

  /**
   * Iterates over all arguments, adding their own properties to the
   * receiver.
   *
   * @example
   *   obj.mixin({
   *     hello: "world"
   *   });
   *   obj.hello;
   *   // -> "world"
   *
   * @returns {XC.Base} the receiver
   *
   * @see XC.Base.extend
   */
  mixin: function () {
    var len = arguments.length,
      /** @ignore */
      empty = function () {},
      obj, val, fn, cur;

    for (var i = 0; i < len; i++) {
      obj = arguments[i];
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          val = obj[prop];
          cur = this[prop];

          if (XC.isFunction(val) && val._xcInferior && cur) {
            continue;
          }

          if (XC.isFunction(val) && val._xcAround) {
            fn = (cur && XC.isFunction(cur)) ? cur : empty;
            val = val.curry(fn);
          }


          this[prop] = val;
        }
      }

      // Prevents IE from clobbering toString
      if (obj && obj.toString !== Object.prototype.toString) {
        this.toString = obj.toString;
      }
    }
    return this;
  },

  /**
   * Creates a new object which extends the current object.  Any
   * arguments are mixed in to the new object as if {@link XC.Base.mixin}
   * was called on the new object with remaining args.
   *
   * @example
   *   var obj = XC.Base.extend({
   *     hello: "world"
   *   });
   *   obj.hello;
   *   // -> "world"
   * 
   *   XC.Base.hello;
   *   // -> undefined
   * @returns {XC.Base} the new object
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
