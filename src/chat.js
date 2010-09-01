/**
 * One-to-one Chatting
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 4
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Chat = {

  TYPE: 'chat',

  /**
   * Send a message to another entity.
   * 
   * @param {XC.Message} message     The message to send to another entity.
   * @param {Object}     [callbacks] An Object that has 'onError'.
   */
  send: function (message, callbacks) {
    var msg = XC.XMPP.Message.extend(),
        body = XC.XML.Element.extend({name: 'body'}),
        subject = XC.XML.Element.extend({name: 'subject'}),
        thread = XC.XML.Element.extend({name: 'thread'}),
        active = XC.XML.Element.extend({name: 'active',
                                        xmlns: this.XMLNS});
    msg.from(message.from.jid);
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
  },

  /**
   * Endpoint to recieve out-of-band messages.
   * 
   * @param {XC.Message} message     A message from another entity.
   */
  onMessage: function (message) {},

  /**
   * Handles out-of-band messages (All incoming messages)
   * from another entity.
   * 
   * @param {Element} packet        The incoming XML stanza.
   */
  _handleMessages: function (packet) {
    var msg = XC.Message.extend({
      to: XC.Entity.extend({jid: packet.getAttribute('to')}),
      from: XC.Entity.extend({jid: packet.getAttribute('from')})
    }), subject, body, thread;

    if (packet.getType() === 'chat') {
      subject = packet.getElementsByTagName('subject');
      if (subject && subject[0]) {
        msg.subject = subject[0].text;
      }

      body = packet.getElementsByTagName('body');
      if (body && body[0]) {
        msg.body = body[0].text;
      }

      thread = packet.getElementsByTagName('thread');
      if (thread && thread[0]) {
        msg.thread = thread[0].text;
      }

      this.onMessage(msg);
    }
  }
};
