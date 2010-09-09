/**
 * Presence Mixin.
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 5 & 6
 * @see http://www.ietf.org/rfc/rfc3921.txt
 */
XC.Mixin.Presence = {

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
   * @param {String} [show]       'away', 'chat', 'dnd', or 'xa' as defined in XC.Presence.SHOW
   * @param {String} [status]     The custom status message to send.
   * @param {Number} [priority]   An integer between -127 and +128 giving the priority of the presence.
   * @param {Object} [callbacks]  An Object with 'onSuccess' and 'onError'.
   */
  sendPresence: function (show, status, priority, callbacks) {
    var p = XC.XMPP.Presence.extend();

    // Send directed presence.
    p.to(this.jid);

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
      }), iPriority = parseInt(presence.priority, 10);

      // The priority MUST be an integer between -128 and +127
      if (iPriority > -128 && iPriority < 127) {
        priorityEl.text = priority;
        p.addChild(priorityEl);
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
