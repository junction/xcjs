/**
 * @extends XC.Base
 * @class
 */
XC.Message = XC.Base.extend(/** @lends XC.Message */{
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
  subject: null,

  /**
   * @type {String}
   */
  body: null,

  /**
   * @type {String}
   */
  thread: null,

  /**
   * @type {String}
   */
  id: null,

  /**
   * Reply to a message using this
   * message as a template, switching the
   * to and from attributes.
   *
   * @param {String} body  The message body.
   * @param {String} [id]  The id to associate with the message.
   * @returns {XC.Message} The sent message.
   */
  reply: function (body, id) {
    var msg = this.extend({
      to: this.from,
      from: this.connection.getJID(),
      body: body,
      id: id
    });

    this.connection.send(msg.toXML().convertToString());
  },

  /**
   * Converts a message into an XML Fragment.
   * 
   * @returns {Element} A XML Fragment.
   */
  toXML: function () {
    var msg = XC.XMPP.Message.extend(),
        body = XC.XML.Element.extend({name: 'body'}),
        subject = XC.XML.Element.extend({name: 'subject'}),
        thread = XC.XML.Element.extend({name: 'thread'});

    msg.to(this.to.jid);
    if (this.id) {
      msg.attr('id', this.id);
    }
    msg.attr('type', this.type);

    if (this.body) {
      body.text = this.body;
      msg.addChild(body);
    }

    if (this.subject) {
      subject.text = this.subject;
      msg.addChild(subject);
    }

    if (this.thread) {
      thread.text = this.thread;
      msg.addChild(thread);
    }

    return msg;
  }

});
