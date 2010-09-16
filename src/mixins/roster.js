/**
 * Roster Management
 * @namespace
 *
 * RFC 3921: XMPP IM; Section 7 & 8
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Mixin.Roster = {

  roster: {
    /**
     * The optional name of the entity.
     * @type {String}
     */
    name: null,

    /**
     * The groups the entity is a part of.
     * @type {Array}
     */
    groups: null,

    /**
     * What the user is requesting
     * 'subscribe'
     * @type {Array}
     */
    ask: null,

    /**
     * The subscription type of the entity
     * 'none', 'to', 'from', or 'both'
     * @type {Array}
     */
    subscription: null
  },

  /**
   * Update an entity in your roster.
   *
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  setRosterItem: function (callbacks) {
    var entity = this,
        iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Roster.XMLNS}),
        item = XC.XML.Element.extend({name: 'item'}),
        Group = XC.XML.Element.extend({name: 'group'}),
        len = (entity.roster && entity.roster.groups) ? entity.roster.groups.length : 0,
        group;
    iq.type('set');
    item.attr('jid', entity.jid);

    if (entity.roster.name) {
      item.attr('name', entity.roster.name);
    }

    for (var i = 0; i < len; i++) {
      group = Group.extend();
      group.text = entity.roster && entity.roster.groups[i];
      item.addChild(group);
    }

    q.addChild(item);
    iq.addChild(q);
    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError && XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else if (callbacks && callbacks.onSuccess && XC.isFunction(callbacks.onSuccess)) {
        callbacks.onSuccess(entity);
      }
    });
  },

  /**
   * Remove an entity from your roster.
   *
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  removeRosterItem: function (callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Roster.XMLNS}),
        item = XC.XML.Element.extend({name: 'item'}),
        entity = this;

    iq.from(this.connection.getJID());
    iq.attr('type', 'set');
    item.attr('jid', entity.jid);
    item.attr('subscription', 'remove');

    q.addChild(item);
    iq.addChild(q);
    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError && XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else if (callbacks && callbacks.onSuccess && XC.isFunction(callbacks.onSuccess)) {
        callbacks.onSuccess(entity);
      }
    });
  }

};
