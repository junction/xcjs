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
    this._isAround = true;
    return this;
  },

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
  }
});

/**
 * Array mixins
 */
XC.Base.mixin.call(Array, /** @lends Array */ {

  /**
   * Convert an iterable object into an Array.
   *
   * @param Object An object that is iterable
   * @example
   *   function commaSeparate () {
   *     return Array.from(arguments).join(', ');
   *   }
   */
  from: function (iterable) {
    return Array.prototype.slice.apply(iterable);
  }
});

/**
 * Internet Explorer doesn't implement indexOf,
 * so implement it here.
 *
 * @lends Array.prototype
 */
Array.prototype.indexOf = Array.prototype.indexOf || function (o) {
  for (var i = 0; i < this.length; i++)  {
    if (this[i] === o) {
      return i;
    }
  }
  return -1;
};

/**
 * Node.firstChild is insufficient to return the first child node
 * that is an element
 */
Node.prototype.getFirstElementChild = function () {
  for (var i = 0, l = this.childNodes.length; i < l; i++) {
    if (this.childNodes[i].nodeType === Node.ELEMENT_NODE) {
      return this.childNodes[i];      
    }
  }
  return null;
};
