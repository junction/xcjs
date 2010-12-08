/**
 * @class
 * Presence
 *
 * @extends XC.Base
 * @extends XC.Mixin.HandlerRegistration
 *
 * @see <a href="http://www.ietf.org/rfc/rfc3921.txt">RFC 3921: XMPP IM; Section 5 & 6</a>
 */
XC.Service.Presence = XC.Base.extend(XC.Mixin.HandlerRegistration,
  /** @lends XC.Service.Presence# */ {

  /**
   * Register for incoming stanzas
   * @private
   */
  init: function ($super) {
    $super.apply(this, Array.from(arguments).slice(1));

    if (this.connection) {
      this.connection.registerStanzaHandler({
        element: 'presence'
      }, this._handlePresence, this);
    }
    return this;
  }.around(),

  /**
   * Broadcast presence to all users subscribed to your presence.
   *
   * @param {String} [show] 'away', 'chat', 'dnd', or 'xa'
   *                        as defined in XC.Registrar.Presence.SHOW
   * @param {String} [status] The custom status message to send.
   * @param {Number} [priority] An integer between -127 and +128
   *                            giving the priority of the presence.
   */
  send: function (show, status, priority) {
    var p = XC.PresenceStanza.extend({
      show: show,
      status: status,
      priority: priority
    });

    this.connection.send(p.toStanzaXML().convertToString());
  },

  /**
   * Send 'unavailable' presence.
   *
   * @param {String} [status] A custom message, typically giving
   *                          a reason why the user is unavailable.
   */
  sendUnavailable: function (status) {
    var p = XC.PresenceStanza.extend({
      type: 'unavailable',
      status: status
    });

    this.connection.send(p.toStanzaXML().convertToString());
  },

  /**
   * Call {@link this.registerHandler} with "onPresence" to register for
   * inbound presence stanzas when there is no type or the user becomes
   * "unavailable".
   * @name XC.Service.Presence#onPresence
   * @event
   * @param {XC.Entity} entity An entity representing a presence probe
   *                           response from the server.
   */

  /**
   * Call {@link this.registerHandler} with "onSubscribe" to register for
   * subscription requests.
   * @name XC.Service.Presence#onSubscribe
   * @event
   * @param {XC.PresenceStanza} request
   *    A bundled function to respond easily to the request.
   */

  /**
   * Call {@link this.registerHandler} with "onSubscribed" to register for
   * an event when you have been subscribed to an entity.
   * @name XC.Service.Presence#onSubscribed
   * @event
   * @param {XC.PresenceStanza} request
   *    A bundled function to respond easily to the request.
   */

  /**
   * Call {@link this.registerHandler} with "onUnubscribe" to register for
   * unsubscribe notifications.
   * @name XC.Service.Presence#onUnsubscribe
   * @event
   * @param {XC.PresenceStanza} request
   *    A bundled function to respond easily to the request.
   */

  /**
   * Call {@link this.registerHandler} with "onUnubscribed" to register for
   * unsubscribed notifications.
   * @name XC.Service.Presence#onUnsubscribed
   * @event
   * @param {XC.PresenceStanza} request
   *    A bundled function to respond easily to the request.
   */

  /**
   * Handle out-of-band presence stanzas
   *
   * @private
   * @param {Element} packet The incoming XML stanza.
   */
  _handlePresence: function (packet) {
    var jid = packet.getFrom(),
        type = packet.getType(),
        entity = this.connection.Entity.extend({jid: jid, presence: {}}),
        connection = this.connection,
        presence = connection.PresenceStanza.extend({packet: packet});

    if (!type) {
      entity.presence.available = true;
      entity.presence.show = presence.show;
      entity.presence.status = presence.status;
      entity.presence.priority = presence.priority;
      this.fireHandler('onPresence', entity);
    }

    switch (type) {
    case 'error':
      break;
    case 'probe': // Server-side only
      break;
    case 'subscribe':
    case 'subscribed':
    case 'unsubscribe':
    case 'unsubscribed':
      this.fireHandler('on' + type.charAt(0).toUpperCase() + type.slice(1), presence);
      break;
    case 'unavailable':
      entity.presence.available = false;
      entity.presence.status = presence.status;
      this.fireHandler('onPresence', entity);
      break;
    }
  }

});
