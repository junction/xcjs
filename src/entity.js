/**
 * An entity is anything with a Jabber ID (JID).
 *
 * @requires XC.Connection A connection to do action on.
 *
 * @class
 * @extends XC.Base
 * @extends XC.Mixin.Presence
 * @extends XC.Mixin.Roster
 * @extends XC.Mixin.Chat
 * @extends XC.Mixin.Disco
 * @extends XC.Mixin.JID
 * @extends XC.Mixin.ChatStateNotification.Entity
 * @extends XC.Mixin.VCard.Entity
 */
XC.Entity = XC.Base.extend(/** @lends XC.Entity# */{
  /**
   * The Jabber ID of the entity.
   * @type String
   */
  jid: null

}, XC.Mixin.JID,
   XC.Mixin.Presence,
   XC.Mixin.Roster,
   XC.Mixin.Chat,
   XC.Mixin.ChatStateNotification.Entity,
   XC.Mixin.Disco,
   XC.Mixin.VCard.Entity);
