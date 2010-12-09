/**
 * @namespace
 * <p>XMPP Client Library core object.</p>
 *
 * <p>XC is designed to be a RFC / XEP compliant JavaScript library that
 * provides an abstract API to perform common XMPP actions. This library
 * is not intended to ensure proper flows, and those wishing to make a
 * compliant client should read RFC 3920, RFC 3921, and any XEPs that
 * you plan on using. Again, this XMPP stack ensures proper messaging,
 * not control flow.</p>
 *
 * <p>XC is <b>NOT</b> a BOSH client, and purposely uses the adapter design
 * pattern so you may provide your own.</p>
 */
var XC = {
  /**
   * Prints a debug message to the console, if window.console exists.
   * @returns {void}
   */
  debug: function () {
    return window.console && window.console.debug && window.console.debug.apply && window.console.debug.apply(window.console, arguments);
  },

  /**
   * Prints a log to the console, if window.console exists.
   * @returns {void}
   */
  log: function () {
    return window.console && window.console.log && window.console.warn.apply && window.console.log.apply(window.console, arguments);
  },

  /**
   * Prints a warning to the console, if window.console exists.
   * @returns {void}
   */
  warn: function () {
    return window.console && window.console.warn && window.console.warn.apply && window.console.warn.apply(window.console, arguments);
  },

  /**
   * Prints an error to the console, if window.console exists.
   * @returns {void}
   */
  error: function () {
    return window.console && window.console.error && window.console.error.apply && window.console.error.apply(window.console, arguments);
  },

  /**
   * Begins a console group, if it's able to; otherwise it tries to print a log.
   * @returns {void}
   */
  group: function () {
    if (window.console && window.console.group) {
      window.console.group.apply(window.console, arguments);
    } else {
      XC.log.apply(XC, arguments);
    }
  },

  /**
   * End a console group.
   * @returns {void}
   */
  groupEnd: function () {
    if (window.console && window.console.groupEnd) {
      window.console.groupEnd();
    }
  },

  /**
   * Returns whether or not the Object passed in
   * is a function.
   *
   * @param {Object} o The Object to test.
   * @returns {Boolean} True if the Object is a function, false otherwise.
   */
  isFunction: function (o) {
    return (/function/i).test(Object.prototype.toString.call(o));
  },

  /**
   * Returns whether or not the Object passed in
   * is a String.
   *
   * @param {Object} o The Object to test.
   * @returns {Boolean} True if the Object is a String, false otherwise.
   */
  isString: function (o) {
    return (/string/i).test(Object.prototype.toString.call(o));
  }
};

/**
 * @namespace
 * Namespace for services.
 */
XC.Service = {};

/**
 * @namespace
 * Namespace for mixins.
 */
XC.Mixin = {};
