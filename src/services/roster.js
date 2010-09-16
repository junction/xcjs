/**
 * Roster Management
 * @class
 * @extends XC.Base
 * @extends XC.Mixin.HandlerRegistration
 *
 * RFC 3921: XMPP IM; Section 7 & 8
 * @see http://www.ietf.org/rfc/rfc3921.txt
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
            entities = [], itemsLength = items.length,
            entity, item, groups, len;

        for (var i = 0; i < itemsLength; i++) {
          entities.push(that._entityFromItem(items[i]));
        }

        if (callbacks && callbacks.onSuccess && XC.isFunction(callbacks.onSuccess)) {
          callbacks.onSuccess(entities);
        }
      }
    });
  },

  /**
   * Handle incoming out-of-band Roster IQs
   *
   * @private
   * @param {Element} packet The incoming XML stanza.
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
