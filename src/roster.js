/**
 * Roster Management
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 7 & 8
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Roster = {
  XMLNS: 'jabber:iq:roster',

  /**
   * Request your roster from the server.
   * 
   * @param {Object}   [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  request: function (callbacks) {},

  /**
   * Add a new entity to your roster.
   * (Same as Update + Subscribe.)
   * 
   * @param {XC.Entity} entity      The entity to add to your roster.
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  add: function (entity, callbacks) {},

  /**
   * Update an entity in your roster.
   * 
   * @param {XC.Entity} entity      The entity to update on your roster.
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  update: function (entity, callbacks) {},

  /**
   * Remove an entity from your roster.
   * 
   * @param {XC.Entity} entity      The entity to remove from your roster.
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  remove: function (entity, callbacks) {}

};
