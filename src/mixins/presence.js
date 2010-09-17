/**
 * Presence Mixin.
 * @namespace
 * 
 * @see <a href="http://www.ietf.org/rfc/rfc3921.txt">RFC 3921: XMPP IM; Section 5 & 6</a>
 */
XC.Mixin.Presence = {

  /**
   * A slot to contain presence information.
   * @type {Object}
   * @namespace
   */
  presence: {
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

    /**
     * Whether or not the user is available.
     * @type {Boolean}
     */
    available: null
  },

  // In band

  /**
   * Send presence to all subscribed entities / resources
   * or send direced presence to a specific entity.
   * 
   * @param {String} [show]       'away', 'chat', 'dnd', or 'xa' as defined in XC.Presence.SHOW
   * @param {String} [status]     The custom status message to send.
   * @param {Number} [priority]   An integer between -127 and +128 giving the priority of the presence.
   */
  sendDirectedPresence: function (show, status, priority) {
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
   * Request a subscription to an entity's presence.
   */
  sendPresenceSubscribe: function () {
    var p = XC.XMPP.Presence.extend(),
        entity = this;
    p.attr('type', 'subscribe');
    p.to(entity.jid);

    this.connection.send(p.convertToString());
  },

  /**
   * Unsubscribe from an entity's presence.
   */
  sendPresenceUnsubscribe: function () {
    var p = XC.XMPP.Presence.extend(),
        entity = this;
    p.attr('type', 'unsubscribe');
    p.to(entity.jid);

    this.connection.send(p.convertToString());
  },

  /**
   * Cancel a Presence subscription.
   */
  cancelPresenceSubscription: function () {
    var p = XC.XMPP.Presence.extend(),
        entity = this;
    p.attr('type', 'unsubscribed');
    p.to(entity.jid);

    this.connection.send(p.convertToString());
  }

};
