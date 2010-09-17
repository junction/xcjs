/**
 * Simple error class of XC.
 *
 * @class
 * @param {String} message The message that the error should throw.
 */
XC.Error = function (message) {
  this.message = message;
};
XC.Error.prototype = new Error();
XC.Error.prototype.name = 'XC.Error';
