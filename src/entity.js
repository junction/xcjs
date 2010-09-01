/**
 * @extends XC.Object
 * @class
 */
XC.Entity = XC.Object.extend(/** @lends XC.Entity */{
  /**
   * @type {String}
   */
  jid: null,

  /**
   * @type {String}
   */
  name: null,

  /**
   * @type {Array}
   */
  groups: null,

  /**
   * @type {XC.DiscoItem}
   */
  disco: null,

  /**
   * @type {XC.Presence.SHOW}
   */
  show: null,

  /**
   * @type {String}
   */
  status: null,

  /**
   * A number between -128 and +127
   * @type {Number}
   */
  priority: null
  
});
