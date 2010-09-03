/**
 * Roster Management
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 7 & 8
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Mixin.Roster = {

  XMLNS: 'jabber:iq:roster',

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
   * Update an entity in your roster.
   * 
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  rosterUpdate: function (callbacks) {
    var entity = this,
        iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Mixin.Roster.XMLNS}),
        item = XC.XML.Element.extend({name: 'item'}),
        Group = XC.XML.Element.extend({name: 'group'}),
        idx = !entity.groups ? 0 : entity.groups.length,
        group;
    iq.type('set');
    item.attr('jid', entity.jid);

    if (entity.name) {
      item.attr('name', entity.name);
    }

    while (idx--) {
      group = Group.extend();
      group.text = entity.groups[idx];
      item.addChild(group);
    }

    iq.addChild(item);
    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        callbacks.onSuccess(entity);
      }
    });
  },

  /**
   * Remove an entity from your roster.
   * 
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  rosterRemove: function (callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Mixin.Roster.XMLNS}),
        item = XC.XML.Element.extend({name: 'item'}),
        entity = this;

    item.attr('jid', entity.jid);
    item.attr('subscription', 'remove');

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        callbacks.onSuccess(entity);
      }
    });
  }

};
