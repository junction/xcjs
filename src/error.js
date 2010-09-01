/**
 * Simple error class of XC.
 * 
 * @namespace
 */
XC.Error = function () {
  this.message = Array.prototype.join.apply(arguments, [' ']);
};
XC.Error.prototype = new Error();
XC.Error.prototype.name = 'XC.Error';
