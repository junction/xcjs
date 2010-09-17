/**
 * Roster Management
 * @class
 * @extends XC.Base
 * @extends XC.Mixin.HandlerRegistration
 *
 * @see <a href="http://www.ietf.org/rfc/rfc3921.txt">RFC 3921: XMPP IM; Section 7 & 8</a>
 *
 * @example
 * var xc = XC.Connection.extend(... with connection adapter ...);
 * xc.Roster.registerHandler('onRosterItem', function(xcEntity) {...});
 */
XC.Service.Roster = XC.Base.extend(XC.Mixin.HandlerRegistration, /** @lends XC.Service.Roster */{
  /**
   * Register for incoming stanzas
   * @private
   */
  init: function ($super) {
    $super.apply(this, Array.from(arguments).slice(1));

    if (this.connection) {
      this.connection.registerStanzaHandler({
        element: 'iq',
        xmlns: XC.Roster.XMLNS
      }, this._handleRosterItems, this);
    }

    return this;
  }.around(),

  /**
   * Request your roster from the server.
   *
   * @param {Object}   [callbacks] An Object with 'onError' and 'onSuccess'.
   *   @param {Function} [callbacks.onError] A function taking a stanza as a parameter.
   *     @param {XC.PacketAdapter} callbacks.onError#packet The packet passed into XC.
   *   @param {Function} [callbacks.onSuccess] A function taking a list of entities.
   *     @param {XC.Entity[]} callbacks.onSuccess#entities A list of entities retrieved from your roster.
   */
  requestItems: function (callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: XC.Roster.XMLNS}),
        that = this;
    iq.type('get');
    iq.addChild(q);

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error' &&
          callbacks && callbacks.onError && XC.isFunction(callbacks.onError)) {
        callbacks.onError(packet);
      } else {
        packet = packet.getNode();
        var items = packet.getElementsByTagName('item'),
            entities = [], itemsLength = items.length;

        for (var i = 0; i < itemsLength; i++) {
          entities.push(that._entityFromItem(items[i]));
        }

        if (callbacks && callbacks.onSuccess && XC.isFunction(callbacks.onSuccess)) {
          /**
           * @name callbacks#onSuccess
           * @function
           * @param {XC.Entity[]} entities A list of entities in your roster.
           */
          callbacks.onSuccess(entities);
        }
      }
    });
  },

  /**
   * Call {@link this.registerHandler} with "onRosterItem" to register for this event.
   * @name XC.Service.Roster#onRosterItem
   * @event
   * @param {XC.Entity} entity An entity representing a roster item that has its roster slot set.
   */

  /**
   * Handle incoming out-of-band Roster IQs
   *
   * @private
   * @param {XC.PacketAdapter} packet The incoming XML stanza.
   */
  _handleRosterItems: function (packet) {
    var type = packet.getType();
    packet = packet.getNode();

    // Acknowledge a roster push.
    if (type === 'set') {
      var iq = XC.XMPP.IQ.extend();
      iq.type('result');
      iq.attr('id', packet.getAttribute('id'));
      this.connection.send(iq.convertToString());

    // Process the items passed from the roster.
    }
    var items = packet.getElementsByTagName('item'),
        itemsLength = items.length;

    for (var i = 0; i < itemsLength; i++) {
      this.fireHandler('onRosterItem', this._entityFromItem(items[i]));
    }
  },

  /**
   * Construct an {@link XC.Entity} from a XML fragment from a Roster IQ.
   *
   * @private
   * @param {Element} item A node that contains info about a roster item.
   */
  _entityFromItem: function (item) {
    var entity = this.connection.Entity.extend({
      jid: item.getAttribute('jid'),
      roster: {
        subscription: item.getAttribute('subscription'),
        ask: item.getAttribute('ask'),
        name: item.getAttribute('name'),
        groups: []
      }
    });

    var groups = item.getElementsByTagName('group');
    for (var j = 0, len = groups.length; j < len; j++) {
      entity.roster.groups.push(XC_DOMHelper.getTextContent(groups[j]));
    }
    return entity;
  }

});
