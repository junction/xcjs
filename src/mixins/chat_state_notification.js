XC.ChatState = {
  XMLNS: 'http://jabber.org/protocol/chatstates',
  STATES: {
    ACTIVE: 'active',
    COMPOSING: 'composing',
    PAUSED: 'paused',
    INACTIVE: 'inactive',
    GONE: 'gone'
  }
};

XC.Mixin.ChatStateMessage = XC.Base.extend(XC.Discoverable, {

  state: null,

  toXML: function () {
    if (!this.state || !XC.ChatState.STATES[this.state.toUpperCase()] || this.body) {
      this.state = XC.ChatState.STATES.ACTIVE;
    }

    return XC.XML.Element.extend({name: this.state,
                                  xmlns: XC.ChatState.XMLNS});
  }

});//.addFeature(XC.ChatState.XMLNS);

XC.Mixin.ChatStateMessage.mixin(XC.Message);

XC.Mixin.ChatState = {
  sendComposing: function (to, thread, id) {
    var msg = XC.Message.extend({
      to: to,
      thread: thread,
      id: id,
      state: XC.ChatState.COMPOSING
    });

    this.connection.send(msg.toXML().convertToString());
  },

  sendPaused: function (to, thread, id) {
    var msg = XC.Message.extend({
      to: to,
      thread: thread,
      id: id,
      state: XC.ChatState.PAUSED
    });

    this.connection.send(msg.toXML().convertToString());
  },

  sendInactive: function (to, thread, id) {
    var msg = XC.Message.extend({
      to: to,
      thread: thread,
      id: id,
      state: XC.ChatState.INACTIVE
    });

    this.connection.send(msg.toXML().convertToString());
  },

  sendGone: function (to, thread, id) {
    var msg = XC.Message.extend({
      to: to,
      thread: thread,
      id: id,
      state: XC.ChatState.GONE
    });

    this.connection.send(msg.toXML().convertToString());
  }
};

XC.Base.mixin.call(XC.Entity, XC.Mixin.ChatState);
