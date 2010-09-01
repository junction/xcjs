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
  send: function (entity, callbacks) {},

  /**
   * Send 'unavailable' presence.
   */
  unavailable: function () {},
  
  /**
   * Request a subscription to an entity's presence.
   * 
   * @param {XC.Entity} entity      The entity to request a presence subscription from.
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  subscribe: function (entity, callbacks) {},

  /**
   * Unsubscribe from an entity's presence.
   * 
   * @param {XC.Entity} entity      The entity to unsubscribe from it's presence.
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  unsubscribe: function (entity, callbacks) {},

  // Out of band

  /**
   * Approve a pending subscription request from an entity.
   * 
   * @param {XC.Entity} entity      The entity requesting a presence subscription.
   */
  approveSubscription: function (entity) {},

  /**
   * Deny a pending subscription request from an entity.
   * 
   * @param {XC.Entity} entity      The entity requesting a presence subscription.
   */
  denySubscription: function (entity) {},

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
   * Endpoing notifying that you are unsubscribed from the entity's presence.
   * 
   * @param {XC.Entity} entity      The entity whose presence you are unsubscribed from.
   */
  onUnsubscribed: function (entity) {}
  
};
