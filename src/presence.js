/**
 * Presence
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 5 & 6
 * @see http://www.ietf.org/rfc/rfc3921.txt
 */
XC.Presence = {

  SHOW: {
    AWAY: 'away',  // The entity or resource is temporarily away.
    CHAT: 'chat',  // The entity or resource is actively interested in chatting.
    DND:  'dnd',   // The entity or resource is is busy (dnd = "Do Not Disturb").
    XA:   'xa'     // The entity or resource is away for an extended period 
                   // (xa = "eXtended Away").
  },

  // In band

  /**
   * Send presence to all subscribed entities / resources
   * or send direced presence to a specific entity.
   * 
   * @param {XC.Entity} [entity]    The entity to direct presence to.
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  send: function (entity, callbacks) {
    var p = XC.XMPP.Presence.extend(),
        presence = this.presence;

    // Send directed presence.
    if (to) {
      p.to(to.jid);
    }

    if (this.status) {
      var status = XC.XML.Element.extend({
        name: 'status'
      });
      status.text = presence.status.toString();
      p.addChild(status);
    }

    if (presence.show !== XC.Presence.SHOW.AVAILABLE) {
      var show = XC.XML.Element.extend({
        name: 'show'
      });

      // Show must be one of the pre-defined constants
      if (XC.IM.Presence.SHOW[presence.show.toUpperCase()]) {
        show.text = presence.show;
        p.addChild(show);
      }
    }

    if (presence.priority) {
      var priority = XC.XML.Element.extend({
        name: 'priority'
      }), iPriority = parseInt(presence.priority, 10);

      // The priority MUST be an integer between -128 and +127
      if (iPriority > -128 && iPriority < 127) {
        priority.text = presence.priority;
        p.addChild(priority);
      }
    }

    this.connection.send(p.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      }
    });
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
   * Request a subscription to an entity's presence.
   * 
   * @param {XC.Entity} entity      The entity to request a presence subscription from.
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  subscribe: function (entity, callbacks) {
    var p = XC.XMPP.Presence.extend();
    p.attr('type', 'subscribe');
    p.to(entity.jid);

    this.connection.send(p.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError();
      }
    });
  },

  /**
   * Unsubscribe from an entity's presence.
   * 
   * @param {XC.Entity} entity      The entity to unsubscribe from it's presence.
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  unsubscribe: function (entity, callbacks) {
    var p = XC.XMPP.Presence.extend();
    p.attr('type', 'unsubscribe');
    p.to(entity.jid);

    this.connection.send(p.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError();
      }
    });
  },

  // Out of band

  /**
   * Approve a pending subscription request from an entity.
   * 
   * @param {XC.Entity} entity      The entity requesting a presence subscription.
   */
  approveSubscription: function (entity) {
    var p = XC.XMPP.Presence.extend();
    p.attr('type', 'subscribed');
    p.to(entity.jid);

    this.connection.send(p.convertToString());
  },

  /**
   * Deny a pending subscription request from an entity.
   * 
   * @param {XC.Entity} entity      The entity requesting a presence subscription.
   */
  denySubscription: function (entity) {
    var p = XC.XMPP.Presence.extend();
    p.attr('type', 'unsubscribed');
    p.to(entity.jid);

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
  
};
