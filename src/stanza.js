/**
 * @extends XC.Base
 * @class
 */
XC.Stanza = XC.Base.extend(/** @lends XC.Stanza */{
  init: function($super) {
    $super.apply(this, Array.from(arguments).slice(1));

    if (this.packet) {
      var pkt = this.packet;
      this.mixin({
        to: XC.Entity.extend({jid: pkt.getTo()}),
        from: XC.Entity.extend({jid: pkt.getFrom()}),
        type: pkt.getType(),
        id: pkt.getNode().getAttribute('id'),
        xmlns: pkt.getNode().getAttribute('xmlns')
      });
    }
  }.around(),

  /**
   * @type {XC.Entity}
   */
  to: null,

  /**
   * @type {XC.Entity}
   */
  from: null,

  /**
   * @type {String}
   */
  id: null,

  /**
   * @type {String}
   */
  type: null,

  /**
   * @private
   */
  xmlStanza: null,

  /**
   * Converts a stanza into an XML Fragment.
   *
   * @returns {XC.XML.Element} A XML Fragment.
   */
  toStanzaXML: function ($super) {
    if (!this.xmlStanza) throw new XC.Error('undefined XML stanza type');

    var stanza = $super.apply(this,Array.from(arguments).slice(1)) || this.xmlStanza.extend();

    if (this.to)
      stanza.to(this.to.jid);

    if (this.from)
      stanza.from(this.from.jid);

    stanza.id(this.id);
    stanza.type(this.type);

    return stanza;
  }.around()

});
