/**
 * JID Manipulation
 * @class
 * @extends XC.Base
 *
 * @see <a href="http://xmpp.org/rfcs/rfc3920.html#addressing">RFC 3920: XMPP Core; Addressing</a>
 */
XC.Mixin.JID = XC.Base.extend(/** @lends XC.Mixin.JID# */{

  /**
   * @returns {String} The bare JID of the entity.
   * @example
   *   var mal = this.xc.Entity.extend({
   *     jid: 'mal@serenity.com/persephone'
   *   });
   *   mal.getBareJID();
   *   // -> 'mal@serenity.com'
   */
  getBareJID: function () {
    var ret = "";
    ret += (this.getJIDParts().node) ? this.getJIDParts().node + "@" : "";
    ret += this.getJIDParts().domain;
    return ret;
  },

  /**
   * @returns {String} The JID node (commonly used as a username).
   * @example
   *   var mal = this.xc.Entity.extend({
   *     jid: 'mal@serenity.com/persephone'
   *   });
   *   mal.getJIDNode();
   *   // -> 'mal'
   */
  getJIDNode: function () {
    return this.getJIDParts().node;
  },

  /**
   * @returns {String} The JID's domain.
   * @example
   *   var mal = this.xc.Entity.extend({
   *     jid: 'mal@serenity.com/persephone'
   *   });
   *   mal.getJIDDomain();
   *   // -> 'serenity.com'
   */
  getJIDDomain: function () {
    return this.getJIDParts().domain;
  },

  /**
   * @returns {String} The resource of the JID.
   * @example
   *   var mal = this.xc.Entity.extend({
   *     jid: 'mal@serenity.com/persephone'
   *   });
   *   mal.getJIDResource();
   *   // -> 'persephone'
   */
  getJIDResource: function () {
    return this.getJIDParts().resource;
  },

  /**
   * @returns {String} The parts of the JID.
   * @example
   *   var mal = this.xc.Entity.extend({
   *     jid: 'mal@serenity.com/persephone'
   *   });
   *   mal.getJIDParts();
   *   // -> {
   *   // node: 'mal',
   *   // domain: 'serenity.com',
   *   // resource: 'persephone'
   *   // }
   */
  getJIDParts: function () {
    if (this.jid && this.jid._cachedJIDParts) {
      return this.jid._cachedJIDParts;
    }

    var parts = this.jid.match(/^([^@\/]*(?=@)|)[@]?([^\/]*)[\/]?(.*)?$/),
      ret = {
        node: parts[1] || null,
        domain: parts[2] || null,
        resource: parts[3] || null
      };

    this.jid._cachedJIDParts = ret;
    return ret;
  }
});
