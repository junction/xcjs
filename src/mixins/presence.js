/**
 * @class
 * Presence Mixin.
 * 
 * @see <a href="http://www.ietf.org/rfc/rfc3921.txt">RFC 3921: XMPP IM; Section 5 & 6</a>
 */
XC.Mixin.Presence = /** @lends XC.Mixin.Presence# */{

  /**
   * @namespace
   * A slot to contain presence information.
   * @type Object
   */
  presence: {
    /**
     * What the status of the entity is.
     * @type XC.Registrar.Presence.SHOW
     */
    show: null,

    /**
     * The custom status of the entity.
     * @type String
     */
    status: null,

    /**
     * A number between -128 and +127
     * @type Number
     */
    priority: null,

    /**
     * Whether or not the user is available.
     * @type Boolean
     */
    available: null
  },

  // In band

  /**
   * Send presence to all subscribed entities / resources
   * or send direced presence to a specific entity.
   * 
   * @param {String} [show] 'away', 'chat', 'dnd', or 'xa'
   *                         as defined in XC.Registrar.Presence.SHOW
   * @param {String} [status] The custom status message to send.
   * @param {Number} [priority] An integer between -127 and +128
   *                            giving the priority of the presence.
   * @returns {void}
   */
  sendDirectedPresence: function (show, status, priority) {
    var p = XC.PresenceStanza.extend({
      show: show,
      status: status,
      priority: priority,
      to: this
    });

    this.connection.send(p.toStanzaXML().toString());
  },

  /**
   * Request a subscription to an entity's presence.
   * @returns {void}
   */
  sendPresenceSubscribe: function () {
    var p = XC.XML.XMPP.Presence.extend();
    p.attr('type', 'subscribe');
    p.to(this.jid);

    this.connection.send(p.toString());
  },

  /**
   * Unsubscribe from an entity's presence.
   * @returns {void}
   */
  sendPresenceUnsubscribe: function () {
    var p = XC.XML.XMPP.Presence.extend();
    p.attr('type', 'unsubscribe');
    p.to(this.jid);

    this.connection.send(p.toString());
  },

  /**
   * Cancel a Presence subscription.
   * @returns {void}
   */
  cancelPresenceSubscription: function () {
    var p = XC.XML.XMPP.Presence.extend();
    p.attr('type', 'unsubscribed');
    p.to(this.jid);

    this.connection.send(p.toString());
  }

};
