/**
 * Mixin to provide callback handler registration to
 * the services that mix it in.
 *
 * @namespace
 */
XC.Mixin.HandlerRegistration = {

  /**
   * @private
   */
  init: function($super) {
    var tmp = {};
    if (this._registeredHandlers)
      tmp = XC.Base.extend(this._registeredHandlers);

    this._registeredHandlers = tmp;

    if (XC.Base.isFunction($super))
      $super.apply(this, Array.from(arguments).slice(1));
  }.around(),

  /**
   * register a callback handler for a named event.
   * it is the responsibility of the caller of this function
   * to either properly bind callbacks or provide a target
   * scope to apply to the callback.
   *
   * @param {String} event      event name
   * @param {Function} callback function to fire as the callback
   * @param {Object} [target]   object to which 'this' will be bound
   *
   * @returns {Boolean} True indicates success
   */
  registerHandler: function(event,callback,target) {
    if (!XC.Base.isFunction(callback))
      return false;

    this._registeredHandlers[event] = {
      action: callback,
      target: target || this
    };

    return true;
  },

  /**
   * @private
   */
  fireHandler: function(event) {
    if (this._registeredHandlers[event]) {
      var action = this._registeredHandlers[event].action,
        target = this._registeredHandlers[event].target;
      action.apply(target,Array.from(arguments).slice(1));
    }
  }
};
