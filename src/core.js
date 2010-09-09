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
