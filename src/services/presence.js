/**
 * Presence
 * @class
 * @extends XC.Base
 * @extends XC.Mixin.HandlerRegistration,
 *
 * RFC 3921: XMPP IM; Section 5 & 6
 * @see http://www.ietf.org/rfc/rfc3921.txt
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
   * Endpoint for requests to subscribe to your presence.
   *
   * @param {XC.Entity} entity      The entity requesting a presence subscription.
   */
  onSubscribe: function (request) {},

  /**
   * Endpoint notifying that you are subscribed to the entity's presence.
   *
   * @param {XC.Entity} entity      The entity whose presence you are subscribed to.
   */
  onSubscribed: function (request) {},

  /**
   * Endpoint for unsubscribe requests.
   *
   * @param {XC.Entity} entity      The entity whose presence you are unsubscribe from.
   */
  onUnsubscribe: function (request) {},

  /**
   * Endpoint notifying that you are unsubscribed from the entity's presence.
   *
   * @param {XC.Entity} entity      The entity whose presence you are unsubscribed from.
   */
  onUnsubscribed: function (request) {},

  /**
   * Endpoint notifying you of updated presence.
   *
   * @param {XC.Entity} entity  The entity whose presence changed.
   */
  onPresence: function (entity) {},

  /**
   * Handle out-of-band presence stanzas
   *
   * @param {Element} packet The incoming XML stanza.
   */
  _handlePresence: function (packet) {
    var jid = packet.getFrom(),
        type = packet.getType(),
        entity = XC.Entity.extend({jid: jid}),
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

      entity.available = true;
      if (show) {
        entity.show = show.textContent || show.text;
      }

      if (status) {
        entity.status = status.textContent || status.text;
      }

      if (priority) {
        entity.priority = parseInt(priority.textContent || priority.text, 10);
      }

      this.onPresence(entity);
    }

    switch (type) {
    case 'error':
      break;
    case 'probe': // Server-side only
      break;
    case 'subscribe':
      if (this.onSubscribe) {
        this.onSubscribe(response('subscribed', 'unsubscribed'));
      }
      break;
    case 'subscribed':
      if (this.onSubscribed) {
        this.onSubscribed(response('subscribe', 'unsubscribe'));
      }
      break;
    case 'unsubscribe':
      if (this.onUnsubscribe) {
        this.onUnsubscribe(response('unsubscribed', 'subscribed'));
      }
      break;
    case 'unsubscribed':
      if (this.onUnsubscribed) {
        this.onUnsubscribe(response('unsubscribe', 'subscribe'));
      }
      break;
    case 'unavailable':
      entity.available = false;
      this.onPresence(entity);
      break;
    }
  }

});
