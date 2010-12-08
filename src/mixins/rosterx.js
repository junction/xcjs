/**
 * @namespace
 * Roster Item Exchange mixin namespace.
 */
XC.Mixin.RosterX = {};

/**
 * @class
 * Roster Item Exchange from third party rosters.
 *
 * @extends XC.Base
 * @extends XC.Mixin.Discoverable
 * @see <a href="http://xmpp.org/extensions/xep-0144.html">Roster Item Exchange</a>
 */
XC.Mixin.RosterX.Service = XC.Base.extend(XC.Mixin.Discoverable,
  /** @lends XC.Mixin.RosterX.Service# */{

  /** @private */
  init: function ($super) {
    if (XC.isFunction($super)) {
      $super.apply(this, Array.from(arguments).slice(1));      
    }

    if (this.connection) {
      this.connection.registerStanzaHandler({
        element: 'iq',
        xmlns: XC.Registrar.RosterX.XMLNS
      }, this._handleRosterItemExchange, this);

      this.connection.registerStanzaHandler({
        element: 'message',
        xmlns: XC.Registrar.RosterX.XMLNS
      }, this._handleRosterItemExchange, this);

      this.addFeature(XC.Registrar.RosterX.XMLNS);
    }
  }.around(),

  /**
   * @name XC.Mixin.RosterX.Service#onRosterExchangeItems
   * @event
   * @param {XC.RosterX.Entity[]} entities A list of entities sent by a roster exchange.
   * @param {String} from The JID that the roster item exchange request was sent from.
   * @param {String} [reason] The accompanying body if
   *   the roster item exchange's parent element was a &lt;message/&gt;
   */

  /**
   * @private
   * Handle a Roster Item Exchange from a third party.
   *
   * @param {XC.PacketAdapter} packet The packet causing the handler to fire.
   */
  _handleRosterItemExchange: function (packet) {
    var node = packet.getNode(),
        entities = [],
        body = XC_DOMHelper.getTextContent(
                 node.getElementsByTagName('body')[0]
               ) || '',
        items = node.getElementsByTagName('item'),
        from = node.getAttribute('from'),
        i = 0, len = items.length;

    for (i; i < len; i++) {
      entities.push(this._rosterxEntityFromItem(items[i]));
    }
    this.fireHandler('onRosterExchangeItems', entities, from, body);
  },

  /**
   * @private
   * Construct a {@link XC.RosterX.Entity} from a XML fragment
   * from a Roster Item Exchange.
   *
   * @param {Element} item A node that contains info about a roster item.
   */
  _rosterxEntityFromItem: function (item) {
    var entity = this.connection.Entity.extend(XC.Mixin.RosterX.Entity, {
      jid: item.getAttribute('jid'),
      rosterx: {
        action: item.getAttribute('action'),
        name: item.getAttribute('name'),
        groups: []
      }
    });

    var groups = item.getElementsByTagName('group');
    for (var j = 0, len = groups.length; j < len; j++) {
      entity.rosterx.groups.push(XC_DOMHelper.getTextContent(groups[j]));
    }
    return entity;
  }

});

/**
 * @class
 * @see <a href="http://xmpp.org/extensions/xep-0144.html">Roster Item Exchange</a>
 */
XC.Mixin.RosterX.Entity = /** @lends XC.Mixin.RosterX.Entity# */{

  /**
   * The Roster Item Exchange slot
   * @namespace
   */
  rosterx: {
    /**
     * The suggested action on the Roster Exchange Item
     * @type String
     */
    action: null,

    /**
     * The Entity's suggested name.
     * @type String
     */
    name: null,

    /**
     * The Entity's suggested groups.
     * @type String[]
     */
    groups: null
  },

  /**
   * Accept the Roster Item Exchange suggestion,
   * and commit the changes to your roster.
   * @returns {void}
   */
  acceptRosterX: function () {
    switch (this.rosterx.action) {
    case 'add':
    case 'modify':
      this.roster = {
        name: this.rosterx.name,
        groups: this.rosterx.groups
      };
      this.setRosterItem();
      break;
    case 'delete':
      this.removeRosterItem();
      break;
    }
  }
};

/**
 * @namespace
 * The Roster Item Exchange namespace.
 * @name XC.RosterX
 */

/**
 * @name XC.RosterX.Entity
 * @class
 *
 * This type of {@link XC.Entity} is only created when coming from
 * the {@link XC.Mixin.RosterX.Service#onRosterExchangeItems} callback.
 *
 * @extends XC.Entity
 * @extends XC.Mixin.RosterX.Entity
 * @see <a href="http://xmpp.org/extensions/xep-0144.html">Roster Item Exchange</a>
 */
