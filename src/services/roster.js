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
  requestItems: function (callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Roster.XMLNS}),
        that = this.connection;
    iq.type('get');
    iq.addChild(q);

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        if (callbacks) {
          callbacks.onError(packet);
        }
      } else {
        packet = packet.getNode();
        var items = packet.getElementsByTagName('item'),
            entities = [], itemsLength = items.length,
            entity, item, groups, len;

        for (var i = 0; i < itemsLength; i++) {
          item = items[i];
          entity = that.Entity.extend({
            jid: item.getAttribute('jid'),
            subscription: item.getAttribute('subscription'),
            ask: item.getAttribute('ask'),
            name: item.getAttribute('name')
          });
          groups = item.getElementsByTagName('group');
          len = groups ? groups.length : 0;

          if (len) {
            entity.groups = [];
          }

          for (var j = 0; j < len; j++) {
            entity.groups.push(groups[j].textContent || groups[j].text);
          }
          entities.push(entity);
        }

        if (callbacks) {
          callbacks.onSuccess(entities);
        }
      }
    });
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
   * @private
   * @param {Element} packet The incoming XML stanza.
   */
  _handleRosterPush: function (packet) {
    var type = packet.getType();

    packet = packet.getNode();

    // Acknowledge a roster push.
    if (type === 'set') {
      var iq = XC.XMPP.IQ.extend();
      iq.type('result');
      iq.attr('id', packet.getAttribute('id'));
      this.connection.send(iq.convertToString());

    // Process the items passed from the roster.
    }
    var items = packet.getElementsByTagName('item'),
        itemsLength = items.length,
        entity, item, groups, len;

    for (var i = 0; i < itemsLength; i++) {
      item = items[i];
      entity = XC.Entity.extend({
        jid: item.getAttribute('jid'),
        subscription: item.getAttribute('subscription'),
        ask: item.getAttribute('ask'),
        name: item.getAttribute('name')
      });
      groups = item.getElementsByTagName('group');
      len = groups ? groups.length : 0;

      if (len) {
        entity.groups = [];
      }

      for (var j = 0; j < len; j++) {
        entity.groups.push(groups[j].textContent || groups[j].text);
      }
      this.onRosterItem(entity);
    }
  }

});
