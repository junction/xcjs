/**
 * Simple error class of XC.
 * 
 * @namespace
 */
XC.Error = function (message) {
  this.message = message;
};
XC.Error.prototype = new Error();
XC.Error.prototype.name = 'XC.Error';
