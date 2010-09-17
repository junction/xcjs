/**
 * This documents how incoming XML stanzas should be wrapped
 * to be ingested by XC properly. This is a stub, and creates a
 * specification for you (the developer) to interface with XC.
 *
 * @name XC.PacketAdapter
 * @class
 */

/**
 * Get the JID that the stanza was sent from.
 * @name XC.PacketAdapter#getFrom
 * @function
 * @returns {String} The JID of the sender.
 */

/**
 * Get the JID that the stanza was sent to.
 * @name XC.PacketAdapter#getTo
 * @function
 * @returns {String} The target JID (should be the same as the connection.)
 */

/**
 * Get the type of the packet (the type attribute in the XML schema).
 * @name XC.PacketAdapter#getType
 * @function
 * @returns {String} The type of the stanza.
 */

/**
 * Get the root node of the XML stanza.
 * @name XC.PacketAdapter#getNode
 * @function
 * @returns {Element} The root element of the XML stanza.
 */
