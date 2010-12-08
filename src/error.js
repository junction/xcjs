/**
 * @class
 * Simple error class of XC.
 *
 * @param {String} message The message that the error should throw.
 * @example
 *   throw new XC.Error('the error message');
 */
XC.Error = function (message) {
  this.message = message;
};
XC.Error.prototype = new Error();
XC.Error.prototype.name = 'XC.Error';
