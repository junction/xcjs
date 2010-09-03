/**
 * Presence Mixin.
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 5 & 6
 * @see http://www.ietf.org/rfc/rfc3921.txt
 */
XC.Mixin.Presence = {

  SHOW: {
    AWAY: 'away',  // The entity or resource is temporarily away.
    CHAT: 'chat',  // The entity or resource is actively interested in chatting.
    DND:  'dnd',   // The entity or resource is is busy (dnd = "Do Not Disturb").
    XA:   'xa'     // The entity or resource is away for an extended period 
                   // (xa = "eXtended Away").
  },

  /**
   * What the status of the entity is.
   * @type {XC.Presence.SHOW}
   */
  show: null,

  /**
   * The custom status of the entity.
   * @type {String}
   */
  status: null,

  /**
   * A number between -128 and +127
   * @type {Number}
   */
  priority: null,

  // In band

  /**
   * Send presence to all subscribed entities / resources
   * or send direced presence to a specific entity.
   * 
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  sendPresence: function (callbacks) {
    var p = XC.XMPP.Presence.extend(),
        presence = this.presence,
        entity = this;

    // Send directed presence.
    if (entity.jid !== this.connnection.getJID()) {
      p.to(entity.jid);
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
      if (XC.Presence.SHOW[presence.show.toUpperCase()]) {
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
   * Request a subscription to an entity's presence.
   * 
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  subscribe: function (callbacks) {
    var p = XC.XMPP.Presence.extend(),
        entity = this;
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
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  unsubscribe: function (callbacks) {
    var p = XC.XMPP.Presence.extend(),
        entity = this;
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
   */
  approveSubscription: function () {
    var p = XC.XMPP.Presence.extend(),
        entity = this;
    p.attr('type', 'subscribed');
    p.to(entity.jid);

    this.connection.send(p.convertToString());
  },

  /**
   * Deny a pending subscription request from an entity.
   */
  denySubscription: function () {
    var p = XC.XMPP.Presence.extend(),
        entity = this;
    p.attr('type', 'unsubscribed');
    p.to(entity.jid);

    this.connection.send(p.convertToString());
  }

};
