/**
 * Simple class for unpacking stanzas.
 *
 * @extends XC.Base
 * @class
 */
XC.Stanza = XC.Base.extend(/** @lends XC.Stanza# */{

  /**
   * Unpack 'to', 'from', 'type', 'id', and 'xmlns'
   * from the packet into the object.
   *
   * @private
   */
  init: function ($super) {
    $super.apply(this, Array.from(arguments).slice(1));

    if (this.packet) {
      if (!this.connection) {
        throw new XC.Error("If a stanza is created with a packet, it MUST " +
                           "have a connection associated with it.");
      }
      var pkt = this.packet;

      this.mixin({
        to: this.connection.Entity.extend({jid: pkt.getTo()}),
        from: this.connection.Entity.extend({jid: pkt.getFrom()}),
        type: pkt.getType(),
        id: pkt.getNode().getAttribute('id'),
        xmlns: pkt.getNode().getAttribute('xmlns')
      });
    }
  }.around(),

  /**
   * The Entity the stanza was sent to.
   * @type {XC.Entity}
   */
  to: null,

  /**
   * The Entity the stanza was sent from.
   * @type {XC.Entity}
   */
  from: null,

  /**
   * The ID attached to the stanza.
   * @type {String}
   */
  id: null,

  /**
   * The type attribute associated with the stanza.
   * @type {String}
   */
  type: null,

  /**
   * The base XML Element to create the stanza.
   * Used in templates that extend Stanza.
   * @private
   * @example
   *   xmlStanza: XC.XMPP.Message
   */
  xmlStanza: null,

  /**
   * Converts a stanza into an XML Fragment.
   *
   * @returns {XC.XML.Element} A XML Fragment.
   */
  toStanzaXML: function ($super) {
    if (!this.xmlStanza) {
      throw new XC.Error('undefined XML stanza type');
    }

    var stanza = $super.apply(this, Array.from(arguments).slice(1)) ||
                                    this.xmlStanza.extend();

    if (this.to) {
      stanza.attr('to', this.to.jid);
    }
    if (this.from) {
      stanza.attr('from', this.from.jid);
    }
    if (this.id) {
      stanza.attr('id', this.id);
    }
    if (this.type) {
      stanza.attr('type', this.type);
    }

    return stanza;
  }.around()

});
