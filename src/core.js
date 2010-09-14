/**
 * XC: XMPP Client Library.
 * @namespace
 *
 * XMPP Client Library.
 */
var XC = {
  debug: function () {
    return window.console && window.console.debug && window.console.debug.apply(window.console, arguments);
  },

  log: function () {
    return window.console && window.console.log && window.console.log.apply(window.console, arguments);
  },

  warn: function () {
    return window.console && window.console.warn && window.console.warn.apply(window.console, arguments);
  },

  error: function () {
    return window.console && window.console.error && window.console.error.apply(window.console, arguments);
  },

  group: function () {
    if (window.console && window.console.group) {
      window.console.group.apply(window.console, arguments);
    } else {
      XC.log.apply(XC, arguments);
    }
  },

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
    return (typeof o === "function");
  },

  /**
   * Returns whether or not the Object passed in
   * is a String.
   *
   * @param {Object} o The Object to test.
   * @returns {Boolea} True if the Object is a String, false otherwise.
   */
  isString: function (o) {
    return o instanceof String || typeof o === 'string';
  }
};

/**
 * Namespace for services.
 * @namespace
 */
XC.Service = {};

/**
 * Namespace for mixins.
 * @namespace
 */
XC.Mixin = {};
