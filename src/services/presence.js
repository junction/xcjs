/**
 * Presence
 * @class
 * @extends XC.Base
 *
 * RFC 3921: XMPP IM; Section 5 & 6
 * @see http://www.ietf.org/rfc/rfc3921.txt
 */
XC.Service.Presence = XC.Base.extend(/** @lends XC.Service.Presence */{

  /**
   * Broadcast presence to all users
   * subscribed to your presence.
   *
   * @param {Object} [callbacks]  An Object with 'onSuccess' and 'onError'.
   */
  send: function (callbacks) {
    XC.Entity.extend({
      connection: this.connection,
      jid: this.connection.getJID()
    }).sendPresence(callbacks);
  },

  /**
   * Send 'unavailable' presence.
   */
  unavailable: function () {
    var p = XC.XMPP.Presence.extend();
    p.type('unavailable');
    this.connection.send(p.convertToString());
  },

  /**
   * Endpoint for requests to subscribe to your presence.
   *
   * @param {XC.Entity} entity      The entity requesting a presence subscription.
   */
  onSubscribe: function (entity) {},

  /**
   * Endpoint notifying that you are subscribed to the entity's presence.
   *
   * @param {XC.Entity} entity      The entity whose presence you are subscribed to.
   */
  onSubscribed: function (entity) {},

  /**
   * Endpoint notifying that you are unsubscribed from the entity's presence.
   *
   * @param {XC.Entity} entity      The entity whose presence you are unsubscribed from.
   */
  onUnsubscribed: function (entity) {},

  /**
   * Handle out-of-band presence stanzas
   *
   * @param {Element} packet The incoming XML stanza.
   */
  _handlePresence: function (packet) {
    var jid = packet.getAttribute('from'),
        type = packet.getAttribute('type'),
        entity = XC.Entity.extend({jid: jid});

    switch (type) {
    case 'error':
      break;
    case 'probe':
      break;
    case 'subscribe':
      this.onSubscribe(entity);
      break;
    case 'subscribed':
      this.onSubscribed(entity);
      break;
    case 'unsubscribe':
      break;
    case 'unsubscribed':
      this.onUnsubscribed(entity);
      break;
    }
  }

});
