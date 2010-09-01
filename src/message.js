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
   * @param {String} body The message body.
   */
  reply: function (body) {
    XC.Chat.send(XC.Message.extend({
      to: this.from,
      from: this.to,
      body: body,
      thread: this.thread
    }));
  }

});
