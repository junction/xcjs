/**
 * Chat State Notifications XEP-0085
 * @see http://xmpp.org/extensions/xep-0085.html
 */
XC.ChatStateNotification = {
  XMLNS: 'http://jabber.org/protocol/chatstates',
  STATES: {
    ACTIVE:    'active',
    COMPOSING: 'composing',
    PAUSED:    'paused',
    INACTIVE:  'inactive',
    GONE:      'gone'
  }
};

XC.Mixin.ChatStateNotification = {

  init: function ($super) {
    this.addFeature(XC.ChatStateNotification.XMLNS);

    $super.apply(this, Array.from(arguments).slice(1));
  }.around(),

  sendChatStateNotification: function (state, to, thread, id) {
    var msg = XC.Message.extend({
      to: to,
      thread: thread,
      id: id,
      chatNotificationState: state
    });

    msg.to.connection.send(msg.toStanzaXML().convertToString());
  }
};

XC.Base.mixin.call(XC.Mixin.ChatStateNotification, {
  sendChatStateComposing:
    XC.Mixin.ChatStateNotification.sendChatStateNotification.curry(
      XC.ChatStateNotification.STATES.COMPOSING
    ),
  sendChatStatePaused:
    XC.Mixin.ChatStateNotification.sendChatStateNotification.curry(
      XC.ChatStateNotification.STATES.PAUSED
    ),
  sendChatStateInactive:
    XC.Mixin.ChatStateNotification.sendChatStateNotification.curry(
      XC.ChatStateNotification.STATES.INACTIVE
    ),
  sendChatStateGone:
    XC.Mixin.ChatStateNotification.sendChatStateNotification.curry(
      XC.ChatStateNotification.STATES.GONE
    )
});

XC.Mixin.ChatStateNotification.Message = {
  chatNotificationState: XC.ChatStateNotification.STATES.ACTIVE,

  init: function ($super) {
    $super.apply(this, Array.from(arguments).slice(1));

    if (this.packet) {
      var pkt = this.packet, stateNode;

      stateNode = XC_DOMHelper.getElementsByNS(pkt.getNode(),
                    XC.Mixin.ChatStateNotification.XMLNS);
      stateNode = stateNode[0];

      if (stateNode) {
        this.chatNotificationState = stateNode.nodeName;
      }
    }
  }.around(),

  toStanzaXML: function ($super) {
    var msg = $super.apply(this, Array.from(arguments).slice(1));
    if (this.chatNotificationState) {
      msg.addChild(XC.XML.Element.extend({
        name: this.chatNotificationState,
        xmlns: XC.Mixin.ChatStateNotification.XMLNS
      }));
    }

    return msg;
  }.around()
};
