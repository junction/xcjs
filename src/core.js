/**
 * XC: XMPP Client Library.
 * @namespace
 * 
 * XMPP Client Library.
 */
var XC = {
  debug: function () {
    var message = Array.prototype.join.apply(arguments, [' ']);
    return window.console && window.console.debug && window.console.debug.apply(window.console, [message]);
  },

  log: function () {
    var message = Array.prototype.join.apply(arguments, [' ']);
    return window.console && window.console.log && window.console.log.apply(window.console, [message]);
  },

  warn: function () {
    var message = Array.prototype.join.apply(arguments, [' ']);
    return window.console && window.console.warn && window.console.warn.apply(window.console, [message]);
  },

  error: function () {
    var message = Array.prototype.join.apply(arguments, [' ']);
    return window.console && window.console.error && window.console.error.apply(window.console, [message]);
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
 * Namespaces for services.
 * @namespace
 */
XC.Service = {};

/**
 * Namespace for mixins.
 * @namespace
 */
XC.Mixin = {};
