/**
 * @namespace
 * Roster Management
 *
 * @see <a href="http://ietf.org/rfc/rfc3921.txt">RFC 3921: XMPP IM; Section 7 & 8</a>
 */
XC.Mixin.Roster = /** @lends XC.Mixin.Roster# */{

  /**
   * @namespace
   * A slot to contain roster information.
   * @type Object
   */
  roster: {
    /**
     * The optional name of the entity.
     * @type String
     */
    name: null,

    /**
     * The groups the entity is a part of.
     * @type String[]
     */
    groups: null,

    /**
     * What the user is requesting
     * 'subscribe'
     * @type String
     */
    ask: null,

    /**
     * The subscription type of the entity
     * 'none', 'to', 'from', or 'both'
     * @type String
     */
    subscription: null
  },

  /**
   * Update an entity in your roster.
   *
   * @param {Object} [callbacks]
   *    An Object with methods 'onError' and 'onSuccess'.
   *   @param {Function} [callbacks.onError]
   *      A function that will process roster errors.
   *     @param {XC.PacketAdapter} [callbacks.onError#packet]
   *        The packet that produced the error.
   *   @param {Function} [callbacks.onSuccess]
   *      A function that will be called on a successful roster set.
   *     @param {XC.Entity} [callbacks.onSuccess#entity]
   *        The entity that the roster set was called on.
   * @returns {void}
   */
  setRosterItem: function (callbacks) {
    var entity = this,
        iq = XC.XML.XMPP.IQ.extend(),
        q = XC.XML.XMPP.Query.extend({xmlns: XC.Registrar.Roster.XMLNS}),
        item = XC.XML.Element.extend({name: 'item'}),
        Group = XC.XML.Element.extend({name: 'group'}),
        len = (entity.roster && entity.roster.groups) ?
               entity.roster.groups.length : 0,
        group;
    iq.type('set');
    item.attr('jid', entity.getBareJID());

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
    this.connection.send(iq.toString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError &&
          XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else if (callbacks && callbacks.onSuccess &&
                 XC.isFunction(callbacks.onSuccess)) {
        callbacks.onSuccess(entity);
      }
    });
  },

  /**
   * Remove an entity from your roster.
   *
   * @param {Object} [callbacks]
   *    An Object with methods 'onError' and 'onSuccess'.
   *   @param {Function} [callbacks.onError]
   *      A function that will process roster errors.
   *     @param {XC.PacketAdapter} [callbacks.onError#packet]
   *        The packet that produced the error.
   *   @param {Function} [callbacks.onSuccess]
   *      A function that will be called on a successful roster remove.
   *     @param {XC.Entity} [callbacks.onSuccess#entity]
   *        The entity that the roster remove was called on.
   * @returns {void}
   */
  removeRosterItem: function (callbacks) {
    var iq = XC.XML.XMPP.IQ.extend(),
        q = XC.XML.XMPP.Query.extend({xmlns: XC.Registrar.Roster.XMLNS}),
        item = XC.XML.Element.extend({name: 'item'}),
        entity = this;

    iq.from(this.connection.getJID());
    iq.attr('type', 'set');
    item.attr('jid', entity.getBareJID());
    item.attr('subscription', 'remove');

    q.addChild(item);
    iq.addChild(q);
    this.connection.send(iq.toString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError &&
          XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else if (callbacks && callbacks.onSuccess &&
                 XC.isFunction(callbacks.onSuccess)) {
        callbacks.onSuccess(entity);
      }
    });
  }

};
