/**
 * Utility library for mixing in common functionality to
 * native Javascript objects
 */

/**
 * Function.prototype
 */
XC.Base.mixin.call(Function.prototype, /** @lends Function.prototype */ {

  /**
   * Around adds a flag to a function
   * that lets {@link XC.Base.mixin} know
   * to mixin the function curried with the
   * base function.  If no base function exits
   * the around function will be curried with a
   * dummy Function.  It is up to the client
   * to check the return value of the curried
   * function
   *
   * @example
   *   var foo = XC.Base.extend({
   *     bar: function (junk) {
   *       return 'foo' + junk;
   *     }
   *   });
   *   var fooBar = foo.extend({
   *     bar: function (foosBar, junk) {
   *       return 'foo' + foosBar.call(this, [junk]);
   *     }.around();
   *   });
   *   foo.bar('bell')
   *   // -> 'barbell'
   *   fooBar.bar('n')
   *   // -> 'foobarn'
   */
  around: function () {
    this._xcAround = true;
    return this;
  },

  /**
   * XC is making some pretty bold, and possibly annoying
   * implementations with curry, bind and potentially
   * some other common functions. Mark a function as inferior
   * and if a slot with the same name exists on the receiver
   * at mixin time, XC.Base will NOT mixin that function.
   *
   * BE AWARE however, that this could cause some headaches if
   * you aren't smart with it.
   *
   * @exmple
   * var foo = XC.Base.extend({
   *   bar: function () { return 1; }
   * }, {
   *   bar: function () { return 2; }.inferior()
   * }); // foo.bar() will return 1, normally it would return 2
   */
  inferior: function () {
    this._xcInferior = true;
    return this;
  }
});

// must mix this in separately because we want to call inferior here
XC.Base.mixin.call(Function.prototype, /** @lends Function.prototype */ {
  /**
   * Appends the arguments given to the function,
   * returning a new function that will call the
   * original function with the given arguments appended
   * with the arguments supplied at runtime.
   *
   * @example
   *   function aggregate () {
   *     var sum = 0, idx = arguments.length;
   *     while (idx--) {
   *       sum += arguments[idx];
   *     }
   *     return sum;
   *   }
   *   aggregate(2, 5, 9);
   *   // -> 16
   *   var oneMore = aggregate.curry(1);
   *   oneMore(2, 5, 9);
   *   // -> 17
   */
  curry: function () {
    if (!arguments.length) {
      return this;
    }
    var curriedArgs = Array.from(arguments),
        fn = this;
    return function () {
      return fn.apply(this, curriedArgs.concat(Array.from(arguments)));
    };
  }.inferior(),

  bind: function (target) {
    var _method = this;
    return function () {
      return _method.apply(target, arguments);
    };
  }.inferior()
});

/**
 * Array mixins
 */
XC.Base.mixin.call(Array, /** @lends Array */ {
  /**
   * Convert an iterable object into an Array.
   *
   * @param {Object} object An object that is iterable
   * @example
   *   function commaSeparate () {
   *     return Array.from(arguments).join(', ');
   *   }
   */
  from: function (iterable) {
    return Array.prototype.slice.apply(iterable);
  }.inferior()
});

/**
 * Internet Explorer doesn't implement indexOf,
 * so implement it here.
 *
 * @lends Array.prototype
 */
XC.Base.mixin.call(Array.prototype, /** @lends Array */ {
  /**
   * Returns the index of an object in an Array
   *
   * @param {Object} object The Object to look for.
   * @returns {Number} The index of the Object or -1 if it doesn't exist.
   */
  indexOf: function (o) {
    for (var i = 0; i < this.length; i++)  {
      if (this[i] === o) {
        return i;
      }
    }
    return -1;
  }.inferior()
});
