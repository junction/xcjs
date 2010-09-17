/**
 * An entity is anything with a Jabber ID (JID).
 *
 * @class
 * @extends XC.Base
 * @extends XC.Mixin.Presence
 * @extends XC.Mixin.Roster
 * @extends XC.Mixin.Chat
 * @extends XC.Mixin.Disco
 */
XC.Entity = XC.Base.extend(/** @lends XC.Entity */{
  /**
   * The Jabber ID of the entity.
   * @type {String}
   */
  jid: null

}, XC.Mixin.JID,
   XC.Mixin.Presence,
   XC.Mixin.Roster,
   XC.Mixin.Chat,
   XC.Mixin.ChatStateNotification.Entity,
   XC.Mixin.Disco);
