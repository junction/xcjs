/**
 * Roster Management
 * @namespace
 *
 * RFC 3921: XMPP IM; Section 7 & 8
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Roster = {
  /**
   * The XML namespace for Roster IQs
   * @type {String}
   */
  XMLNS: 'jabber:iq:roster'
};

/**
 * Service Discovery provides the ability to discover information about entities.
 * @namespace
 *
 * XEP-0030: Service Discovery
 * @see http://xmpp.org/extensions/xep-0030.html
 */
XC.Disco = {
  /**
   * The XML namespace for Disco queries.
   * @type {String}
   */
  XMLNS: 'http://jabber.org/protocol/disco'
};

/**
 * Presence
 * @namespace
 *
 * RFC 3921: XMPP IM; Section 5 & 6
 * @see http://www.ietf.org/rfc/rfc3921.txt
 */
XC.Presence = {
  /**
   * Acceptable values for the values inside
   * a <show/> element
   */
  SHOW: {
    AWAY: 'away',  // The entity or resource is temporarily away.
    CHAT: 'chat',  // The entity or resource is actively interested in chatting.
    DND:  'dnd',   // The entity or resource is is busy (dnd = "Do Not Disturb").
    XA:   'xa'     // The entity or resource is away for an extended period 
                   // (xa = "eXtended Away").
  }
};

/**
 * Chat State Notifications
 * @namespace
 *
 * XEP-0085: Chat State Notifications
 * @see http://xmpp.org/extensions/xep-0085.html
 */
XC.ChatStateNotification = {
  /**
   * The XML namespace for Chat State Notifications.
   * @type {String}
   */
  XMLNS: 'http://jabber.org/protocol/chatstates',

  /**
   * Valid states for a conversation flow.
   */
  STATES: {
    ACTIVE:    'active',
    COMPOSING: 'composing',
    PAUSED:    'paused',
    INACTIVE:  'inactive',
    GONE:      'gone'
  }
};
