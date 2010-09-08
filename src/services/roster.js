/**
 * Roster Management
 * @class
 * @extends XC.Base
 *
 * RFC 3921: XMPP IM; Section 7 & 8
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Service.Roster = XC.Base.extend(/** @lends XC.Service.Roster */{

  /**
   * Request your roster from the server.
   *
   * @param {Object}   [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  request: function (callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Roster.XMLNS});
    iq.type('get');
    iq.addChild(q);

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        var items = packet.getElementsByTagName('item'),
            entities = [], idx = items.length,
            entity, item, groups, len;
        while (idx--) {
          item = items[idx];
          entity = XC.Entity.extend({
            jid: item.getAttribute('jid'),
            subscription: item.getAttribute('subscription'),
            name: item.getAttribute('name')
          });
          groups = item.getElemengsByTagName('group');
          len = groups ? groups.length : 0;

          if (len) {
            entity.groups = [];
          }

          while (len--) {
            entity.groups.push(groups[len].text);
          }
          entities.push(entity);
        }
        this.onSuccess(entities);
      }
    });
  },

  /**
   * Add a new entity to your roster.
   * (Same as Update + Subscribe.)
   *
   * @param   {String}    jid     The Jabber ID of the entity to add.
   * @param   {String}    name    The name of the entity.
   * @param   {Array}     groups  The list of groups that the entity belongs to.
   *
   * @returns {XC.Entity} entity  The entity added to your roster.
   */
  add: function (jid, name, groups) {
    var entity = XC.Entity.extend({
      jid: jid,
      name: name,
      groups: groups,
      connection: this.connection
    });

    entity.rosterSet({
      onError: function () {},
      onSuccess: function () {}
    });

    entity.subscribeToPresence({
      onError: function () {},
      onSuccess: function () {}
    });

    return entity;
  },

  /**
   * Endpoint for a server-side roster push.
   *
   * @param {XC.Entity} entity An entity.
   */
  onRosterItem: function (entity) {},

  /**
   * Handle incoming out-of-band Roster IQs
   *
   * @param {Element} packet The incoming XML stanza.
   */
  _handleRoster: function (packet) {
    var type = packet.getAttribute('type');

    // Acknowledge a roster push.
    if (type === 'set') {
      var iq = XC.XMPP.IQ.extend();
      iq.type('result');
      iq.attr('id', packet.getAttribute('id'));
      this.connection.send(iq.convertToString());

    // Process the items passed from the roster.
    } else {
      var items = packet.getElementsByTagName('item'),
          idx = items.length,
          entity, item, groups, len;

      while (idx--) {
        item = items[idx];
        entity = XC.Entity.extend({
          jid: item.getAttribute('jid'),
          subscription: item.getAttribute('subscription'),
          name: item.getAttribute('name')
        });
        groups = item.getElemengsByTagName('group');
        len = groups ? groups.length : 0;

        if (len) {
          entity.groups = [];
        }

        while (len--) {
          entity.groups.push(groups[len].text);
        }
        this.onRosterItem(entity);
      }
    }
  }

});
