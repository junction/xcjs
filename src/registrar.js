/**
 * @namespace
 * The XMPP Registry.
 * The <a href="http://xmpp.org/registrar/">XMPP Registrar</a>
 * maintains registries of protocol namespaces and various parameters.
 */
XC.Registrar = {};

/**
 * @namespace
 * Roster Management constants.
 *
 * @see <a href="http://ietf.org/rfc/rfc3921.txt">RFC 3921: XMPP IM; Section 7 & 8</a>
 */
XC.Registrar.Roster = {
  /**
   * The XML namespace for Roster IQs
   * @type String
   * @constant
   */
  XMLNS: 'jabber:iq:roster'
};

/**
 * @namespace
 * Service Discovery namespace information.
 *
 * @see <a href="http://xmpp.org/extensions/xep-0030.html">XEP-0030: Service Discovery</a>
 */
XC.Registrar.Disco = {
  /**
   * The XML namespace for Disco queries.
   * @type String
   * @constant
   */
  XMLNS: 'http://jabber.org/protocol/disco'
};

/**
 * @namespace
 * Presence constants.
 *
 * @see <a href="http://www.ietf.org/rfc/rfc3921.txt">RFC 3921: XMPP IM; Section 5 & 6</a>
 */
XC.Registrar.Presence = {
  /**
   * @namespace
   * Acceptable values for the values inside
   * a &lt;show/&gt; element.
   */
  SHOW: {
    /** The entity or resource is temporarily away. */
    AWAY: 'away',
    /** The entity or resource is actively interested in chatting. */
    CHAT: 'chat',
    /** The entity or resource is is busy (dnd = "Do Not Disturb"). */
    DND:  'dnd',
    /**
     * The entity or resource is away for an extended period
     * (xa = "eXtended Away").
     */
    XA:   'xa'
  }
};

/**
 * @namespace
 * Chat State Notifications namespace information and valid states.
 *
 * @see <a href="http://xmpp.org/extensions/xep-0085.html">XEP-0085: Chat State Notifications</a>
 */
XC.Registrar.ChatStateNotification = {
  /**
   * The XML namespace for Chat State Notifications.
   * @type String
   * @constant
   */
  XMLNS: 'http://jabber.org/protocol/chatstates',

  /**
   * @namespace
   * Valid states for a conversation flow.
   */
  STATES: {
    /** The user is active and ready to chat; this is entry state. */
    ACTIVE:    'active',
    /** The user is composing a message */
    COMPOSING: 'composing',
    /** The user has paused composing a message */
    PAUSED:    'paused',
    /** The user is inactive */
    INACTIVE:  'inactive',
    /** The user has left the chat */
    GONE:      'gone'
  }
};

/**
 * @namespace
 * Roster Item Exchange namespace information constants.
 *
 * @see <a href="http://xmpp.org/extensions/xep-0144.html">XEP-0144: Roster Item Exchange</a>
 */
XC.Registrar.RosterX = {

  /**
   * The Roster Item Exchange namespace
   * @type String
   * @constant
   */
  XMLNS: 'http://jabber.org/protocol/rosterx',

  /**
   * @namespace
   * Possible actions requested on a node.
   */
  ACTION: {
    /** Add the entity to your roster */
    ADD:    'add',
    /** Modify the entity on your roster */
    MODIFY: 'modify',
    /** Remove the entity from your roster */
    DELETE: 'delete'
  }
};

/**
 * @namespace
 * vcard-temp namespace information constants.
 *
 * @see <a href="http://xmpp.org/extensions/xep-0054.html">XEP-0054: vcard-temp</a>
 */
XC.Registrar.VCard = {
  /**
   * The vCard namespace
   * @type String
   * @constant
   */
  XMLNS: 'vcard-temp'
};

/**
 * @namespace
 * Delayed Delivery namespace.
 *
 * @see <a href="http://xmpp.org/extensions/xep-0203.html">XEP-0203: Delayed Delivery</a>
 */
XC.Registrar.DelayedDelivery = {
  /**
   * The delayed delivery namespace
   * @type String
   * @constant
   */
  XMLNS: 'urn:xmpp:delay'
};

/**
 * @namespace
 * Private XML Storage namespace.
 *
 * @see <a href="http://xmpp.org/extensions/xep-0049.html">XEP-0049: Private XML Storage</a>
 */
XC.Registrar.PrivateStorage = {
  /**
   * The private storage namespace
   * @type String
   * @constant
   */
  XMLNS: 'jabber:iq:private'
};
