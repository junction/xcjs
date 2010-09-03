/**
 * @extends XC.Object
 * @class
 */
XC.Message = XC.Object.extend({
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
   * Reply to a message using this
   * message as a template:
   *   from = to,
   *   to = from,
   *   thread = thread
   * 
   * @param {String} body The message body.
   * @returns {XC.Message} The sent message.
   */
  reply: function (body) {
    var msg = this.extend({
      to: this.from,
      from: this.connection.getJID(),
      body: body
    });

    msg.send();
    return msg;
  },

  /**
   * Send a message.
   * 
   * @param {Object} [callbacks]   An Object with 'onError'.
   */
  send: function (callbacks) {
    var msg = XC.XMPP.Message.extend(),
        body = XC.XML.Element.extend({name: 'body'}),
        subject = XC.XML.Element.extend({name: 'subject'}),
        thread = XC.XML.Element.extend({name: 'thread'}),
        message = this;

    msg.to(message.to.jid);
    msg.attr('type', this.TYPE);

    if (msg.body) {
      body.text = message.body;
      msg.addChild(body);
    }

    if (message.subject) {
      subject.text = message.subject;
      msg.addChild(subject);
    }

    if (message.thread) {
      thread.text = message.thread;
      msg.addChild(thread);
    }

    this.connection.send(msg.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      }
    });
  }

});
