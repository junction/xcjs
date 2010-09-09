/*globals YAHOO */
XC.Test.Presence = new YAHOO.tool.TestCase({
  name: 'XC Presence Service Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

    this.Presence = this.xc.Presence;
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testSend: function () {
    var Assert = YAHOO.util.Assert;

    this.Presence.send(XC.Presence.SHOW.AWAY, 'Out to lunch', 5);

    // <presence>
    //   <show>away</show>
    //   <status>Out to lunch</status>
    //   <priority>5</priority>
    // </presence>
    var response = XC.Test.Packet.extendWithXML(this.conn._data).getNode(),
        show = response.getElementsByTagName('show')[0],
        status = response.getElementsByTagName('status')[0],
        priority = response.getElementsByTagName('priority')[0],
        getText = function (el) {
          return el.textContent || el.text;
        };

    Assert.areEqual(getText(show), "away");
    Assert.areEqual(getText(status), "Out to lunch");
    Assert.areEqual(getText(priority), "5");

    // <presence/>
    this.Presence.send();
    response = XC.Test.Packet.extendWithXML(this.conn._data).getNode();

    Assert.areEqual(response.firstChild, null);
    Assert.areEqual(response.getAttribute('type'), null);
  },

  testUnavailable: function () {
    var Assert = YAHOO.util.Assert;

    // <presence type="unavailable"/>
    this.Presence.sendUnavailable();
    var response = XC.Test.Packet.extendWithXML(this.conn._data);

    Assert.areEqual(response.getType(), 'unavailable');

    // <presence type="unavailable">
    //   <status>Gone home.</status>
    // </presence>
    this.Presence.sendUnavailable("Gone home.");
    response = XC.Test.Packet.extendWithXML(this.conn._data);
    Assert.areEqual(response.getType(), 'unavailable');

    response = response.getNode();
    Assert.areEqual(response.firstChild.textContent || response.firstChild.text, 'Gone home.');
  },

  testOnSubscribe: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="romeo@example.com" \
                     to="' + this.conn.jid() + '" \
                     type="subscribe"/>'
        ), that = this;

    this.Presence.onSubscribe = function (request) {
      Assert.isObject(request);
      Assert.isFunction(request.accept);
      Assert.isFunction(request.deny);
      Assert.areEqual(request.to, that.conn.jid());
      Assert.areEqual(request.from, 'romeo@example.com');
      Assert.areEqual(request.type, 'subscribe');
      Assert.areEqual(request.stanza, packet);

      // Test 'accept'
      request.accept();
      var response = XC.Test.Packet.extendWithXML(that.conn._data);
      Assert.areEqual(response.getType(), 'subscribed');
      Assert.areEqual(response.getTo(), 'romeo@example.com');
      Assert.areEqual(response.getNode().firstChild, null);

      // Test 'deny'
      request.deny();
      response = XC.Test.Packet.extendWithXML(that.conn._data);
      Assert.areEqual(response.getType(), 'unsubscribed');
      Assert.areEqual(response.getTo(), 'romeo@example.com');
      Assert.areEqual(response.getNode().firstChild, null);
    };

    this.Presence._handlePresence(packet);
  },

  testOnSubscribed: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="romeo@example.com" \
                     to="' + this.conn.jid() + '" \
                     type="subscribed"/>'
        ), that = this;

    this.Presence.onSubscribed = function (request) {
      Assert.isObject(request);
      Assert.isFunction(request.accept);
      Assert.isFunction(request.deny);
      Assert.areEqual(request.to, that.conn.jid());
      Assert.areEqual(request.from, 'romeo@example.com');
      Assert.areEqual(request.type, 'subscribed');
      Assert.areEqual(request.stanza, packet);

      // Test 'accept'
      request.accept();
      var response = XC.Test.Packet.extendWithXML(that.conn._data);
      Assert.areEqual(response.getType(), 'subscribe');
      Assert.areEqual(response.getTo(), 'romeo@example.com');
      Assert.areEqual(response.getNode().firstChild, null);

      // Test 'deny'
      request.deny();
      response = XC.Test.Packet.extendWithXML(that.conn._data);
      Assert.areEqual(response.getType(), 'unsubscribe');
      Assert.areEqual(response.getTo(), 'romeo@example.com');
      Assert.areEqual(response.getNode().firstChild, null);
    };

    this.Presence._handlePresence(packet);
  },

  testOnUnsubscribe: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="romeo@example.com" \
                     to="' + this.conn.jid() + '" \
                     type="unsubscribe"/>'
        ), that = this;

    this.Presence.onUnsubscribe = function (request) {
      Assert.isObject(request);
      Assert.isFunction(request.accept);
      Assert.isFunction(request.deny);
      Assert.areEqual(request.to, that.conn.jid());
      Assert.areEqual(request.from, 'romeo@example.com');
      Assert.areEqual(request.type, 'unsubscribe');
      Assert.areEqual(request.stanza, packet);

      // Test 'accept'
      request.accept();
      var response = XC.Test.Packet.extendWithXML(that.conn._data);
      Assert.areEqual(response.getType(), 'unsubscribed', "Accept should be 'unsubscribed'");
      Assert.areEqual(response.getTo(), 'romeo@example.com');
      Assert.areEqual(response.getNode().firstChild, null);

      // Test 'deny'
      request.deny();
      response = XC.Test.Packet.extendWithXML(that.conn._data);
      Assert.areEqual(response.getType(), 'subscribed', "Accept should be 'subscribed'");
      Assert.areEqual(response.getTo(), 'romeo@example.com');
      Assert.areEqual(response.getNode().firstChild, null);
    };

    this.Presence._handlePresence(packet);
  },

  testOnUnsubscribed: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="romeo@example.com" \
                     to="' + this.conn.jid() + '" \
                     type="unsubscribed"/>'
        ), that = this;

    this.Presence.onUnsubscribed = function (request) {
      Assert.isObject(request);
      Assert.isFunction(request.accept);
      Assert.isFunction(request.deny);
      Assert.areEqual(request.to, that.conn.jid());
      Assert.areEqual(request.from, 'romeo@example.com');
      Assert.areEqual(request.type, 'unsubscribed');
      Assert.areEqual(request.stanza, packet);

      // Test 'accept'
      request.accept();
      var response = XC.Test.Packet.extendWithXML(that.conn._data);
      Assert.areEqual(response.getType(), 'unsubscribe');
      Assert.areEqual(response.getTo(), 'romeo@example.com');
      Assert.areEqual(response.getNode().firstChild, null);

      // Test 'deny'
      request.deny();
      response = XC.Test.Packet.extendWithXML(that.conn._data);
      Assert.areEqual(response.getType(), 'subscribe');
      Assert.areEqual(response.getTo(), 'romeo@example.com');
      Assert.areEqual(response.getNode().firstChild, null);
    };

    this.Presence._handlePresence(packet);
  },

  testOnPresence: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          '<presence from="juliet@example.com/chamber" \
                     to="romeo@example.net/orchard"> \
             <show>chat</show> \
             <priority>1</priority> \
           </presence>'
        ), that = this;

    this.Presence.onPresence = function (entity) {
      Assert.areEqual(entity.jid, 'juliet@example.com/chamber');
      Assert.areEqual(entity.show, 'chat');
      Assert.areEqual(entity.priority, 1);
      Assert.areEqual(entity.status, null);
    };

    this.Presence._handlePresence(packet);
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Presence);
