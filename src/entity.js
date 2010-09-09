/**
 * An entity is anything with a Jabber ID (JID).
 *
 * @extends XC.Base
 * @extends XC.Mixin.Presence
 * @extends XC.Mixin.Roster
 * @extends XC.Mixin.Chat
 * @extends XC.Mixin.Disco
 * @class
 */
XC.Entity = XC.Base.extend(/** @lends XC.Entity */{
  /**
   * The Jabber Id of the entity.
   * @type {String}
   */
  jid: null

}, XC.Mixin.Presence,
   XC.Mixin.Roster,
   XC.Mixin.Chat,
   XC.Mixin.Disco);
