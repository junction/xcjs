/**
 * JID Manipulation
 * @class
 * @extends XC.Base
 *
 * RFC 3920: XMPP Core; Addressing
 * @see http://xmpp.org/rfcs/rfc3920.html#addressing
 */
XC.Mixin.JID = XC.Base.extend(/** @lends XC.Mixin.JID */{

  getBareJID: function() {
    var ret = "";
    ret += (this.getJIDParts().node) ? this.getJIDParts().node + "@" : "";
    ret += this.getJIDParts().domain;
    return ret;
  },

  getJIDNode: function() {
    return this.getJIDParts().node;
  },

  getJIDDomain: function() {
    return this.getJIDParts().domain;
  },

  getJIDResource: function() {
    return this.getJIDParts().resource;
  },

  getJIDParts: function() {
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
