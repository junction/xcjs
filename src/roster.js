/**
 * Roster Management
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 7 & 8
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Roster = {
  XMLNS: 'jabber:iq:roster',

  /**
   * Request your roster from the server.
   * 
   * @param {Object}   [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  request: function (callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: this.XMLNS});
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
   * @param {XC.Entity} entity      The entity to add to your roster.
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  add: function (entity, callbacks) {
    this.update(entity, callbacks);
    XC.Presence.subscribe(entity, callbacks);
  },

  /**
   * Update an entity in your roster.
   * 
   * @param {XC.Entity} entity      The entity to update on your roster.
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  update: function (entity, callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: this.XMLNS}),
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
        callbacks.onSuccess();
      }
    });
  },

  /**
   * Remove an entity from your roster.
   * 
   * @param {XC.Entity} entity      The entity to remove from your roster.
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  remove: function (entity, callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: this.XMLNS}),
        item = XC.XML.Element.extend({name: 'item'});

    item.attr('jid', entity.jid);
    item.attr('subscription', 'remove');

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        callbacks.onSuccess();
      }
    });
  },

  /**
   * Endpoint for a server-side roster push.
   *
   * @param {Array} entities An array of entities.
   */
  onRosterPush: function (entities) {},

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
      this.onRosterPush(entities);
    }
  }

};
