/**
 * JID Manipulation
 * @class
 * @extends XC.Base
 *
 * RFC 3920: XMPP Core; Addressing
 * @see http://xmpp.org/rfcs/rfc3920.html#addressing
 */
XC.Mixin.JID = XC.Base.extend(/** @lends XC.Mixin.JID */{

  /**
   * Returns the bare JID of the entity.
   *
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
   * Returns the JID node (commonly used as a username).
   *
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
   * Returns the JID's domain.
   *
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
   * Returns the resource of the JID.
   *
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
   * Returns the parts of the JID.
   *
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
