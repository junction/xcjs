/**
 * Presence
 * @class
 * @extends XC.Base
 * @extends XC.Mixin.HandlerRegistration
 *
 * @see <a href="http://www.ietf.org/rfc/rfc3921.txt">RFC 3921: XMPP IM; Section 5 & 6</a>
 */
XC.Service.Presence = XC.Base.extend(XC.Mixin.HandlerRegistration,
  /** @lends XC.Service.Presence */ {
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
   * @param {String} [show]      'away', 'chat', 'dnd', or 'xa' as defined in XC.Presence.SHOW
   * @param {String} [status]    The custom status message to send.
   * @param {Number} [priority]  An integer between -127 and +128 giving the priority of the presence.
   */
  send: function (show, status, priority) {
    var p = XC.XMPP.Presence.extend();

    if (status) {
      var statusEl = XC.XML.Element.extend({
        name: 'status'
      });
      statusEl.text = status.toString();
      p.addChild(statusEl);
    }

    if (show !== XC.Presence.SHOW.AVAILABLE) {
      var showEl = XC.XML.Element.extend({
        name: 'show'
      });

      // Show must be one of the pre-defined constants
      if (XC.Presence.SHOW[show.toUpperCase()]) {
        showEl.text = show;
        p.addChild(showEl);
      }
    }

    if (priority) {
      var priorityEl = XC.XML.Element.extend({
        name: 'priority'
      }), iPriority = parseInt(priority, 10);

      // The priority MUST be an integer between -128 and +127
      if (iPriority > -128 && iPriority < 127) {
        priorityEl.text = priority;
        p.addChild(priorityEl);
      }
    }

    this.connection.send(p.convertToString());
  },

  /**
   * Send 'unavailable' presence.
   *
   * @param {String} [status]  A custom message, typically giving a reason why the user is unavailable.
   */
  sendUnavailable: function (status) {
    var p = XC.XMPP.Presence.extend();
    p.attr('type', 'unavailable');

    if (status) {
      var statusEl = XC.XML.Element.extend({
        name: 'status'
      });
      statusEl.text = status;
      p.addChild(statusEl);
    }

    this.connection.send(p.convertToString());
  },

  /**
   * Call {@link this.registerHandler} with "onPresence" to register for inbound presence
   * stanzas when there is no type or the user becomes "unavailable".
   * @name XC.Service.Presence#onPresence
   * @event
   * @param {XC.Entity} entity An entity representing a presence probe response from your server.
   */

  /**
   * Call {@link this.registerHandler} with "onSubscribe" to register for subscription requests.
   * @name XC.Service.Presence#onSubscribe
   * @event
   * @param {Object} request A bundled function to respond easily to the request.
   *   @param {Function} request.accept The function to call when you want to accept the subscribe, creating a subscription of type "from".
   *   @param {Function} request.deny The function to call when you want to deny the subscribe, creating a subscription of type "none".
   *   @param {String} to The JID from whom this request was from.
   *   @param {String} from The JID to whom this request is to.
   *   @param {String} type The type on the packet.
   *   @param {XC.PacketAdapter} packet The packet that caused this event.
   */

  /**
   * Call {@link this.registerHandler} with "onSubscribed" to register for an event when you
   * have been subscribed to an entity.
   * @name XC.Service.Presence#onSubscribed
   * @event
   * @param {Object} request A bundled function to respond easily to the request.
   *   @param {Function} request.accept The function to call when you want to accept the subscribed, creating a subscription of type "both".
   *   @param {Function} request.deny The function to call when you want to deny the subscribed, creating a subscription of type "none"
   *   @param {String} to The JID from whom this request was from.
   *   @param {String} from The JID to whom this request is to.
   *   @param {String} type The type on the packet.
   *   @param {XC.PacketAdapter} packet The packet that caused this event.
   */

  /**
   * Call {@link this.registerHandler} with "onUnubscribe" to register for unsubscribe notifications.
   * @name XC.Service.Presence#onUnsubscribe
   * @event
   * @param {Object} request A bundled function to respond easily to the request.
   *   @param {Function} request.accept The function to call when you want to accept the unsubscribe, creating a subscription of type "none".
   *   @param {Function} request.deny The function to call when you want to deny the unsubscribe, creting a subscription of type "to".
   *   @param {String} to The JID from whom this request was from.
   *   @param {String} from The JID to whom this request is to.
   *   @param {String} type The type on the packet.
   *   @param {XC.PacketAdapter} packet The packet that caused this event.
   */

  /**
   * Call {@link this.registerHandler} with "onUnubscribed" to register for unsubscribed notifications.
   * @name XC.Service.Presence#onUnsubscribed
   * @event
   * @param {Object} request A bundled function to respond easily to the request.
   *   @param {Function} request.accept The function to call when you want to accept the unsubscribed, creating a subscription of type "none".
   *   @param {Function} request.deny The function to call when you want to deny the unsubscribe, creting a subscription of type "from".
   *   @param {String} to The JID from whom this request was from.
   *   @param {String} from The JID to whom this request is to.
   *   @param {String} type The type on the packet.
   *   @param {XC.PacketAdapter} packet The packet that caused this event.
   */

  /**
   * Handle out-of-band presence stanzas
   *
   * @param {Element} packet The incoming XML stanza.
   */
  _handlePresence: function (packet) {
    var jid = packet.getFrom(),
        type = packet.getType(),
        entity = this.connection.Entity.extend({jid: jid, presence: {}}),
        connection = this.connection,
        response = function (acceptType, denyType) {
          return {
            accept: function () {
              var p = XC.XMPP.Presence.extend();
              p.attr('type', acceptType);
              p.to(jid);
              connection.send(p.convertToString());
            },
            deny: function () {
              var p = XC.XMPP.Presence.extend();
              p.attr('type', denyType);
              p.to(jid);
              connection.send(p.convertToString());
            },
            to: packet.getTo(),
            from: jid,
            type: type,
            stanza: packet
          };
        };

    if (!type) {
      packet = packet.getNode();
      var show = packet.getElementsByTagName('show')[0],
          status = packet.getElementsByTagName('status')[0],
          priority = packet.getElementsByTagName('priority')[0];

      entity.presence.available = true;
      if (show) {
        entity.presence.show = XC_DOMHelper.getTextContent(show);
      }

      if (status) {
        entity.presence.status = XC_DOMHelper.getTextContent(status);
      }

      if (priority) {
        entity.presence.priority = parseInt(XC_DOMHelper.getTextContent(priority), 10);
      }

      this.fireHandler('onPresence', entity);
    }

    switch (type) {
    case 'error':
      break;
    case 'probe': // Server-side only
      break;
    case 'subscribe':
      this.fireHandler('onSubscribe', response('subscribed', 'unsubscribed'));
      break;
    case 'subscribed':
      this.fireHandler('onSubscribed', response('subscribe', 'unsubscribe'));
      break;
    case 'unsubscribe':
      this.fireHandler('onUnsubscribe', response('unsubscribed', 'subscribed'));
      break;
    case 'unsubscribed':
      this.fireHandler('onUnsubscribed', response('unsubscribe', 'subscribe'));
      break;
    case 'unavailable':
      entity.presence.available = false;
      this.fireHandler('onPresence', entity);
      break;
    }
  }

});
