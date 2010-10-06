/*global YAHOO*/
XC.Test.StropheAdapter = new YAHOO.tool.TestCase({
  name: 'XC Strophe Adapter Tests',
  setUp: function () {
    this.conn = XC.MockStropheConnection.extend();
    this.adapter = XC.StropheAdapter.extend({
      connection: this.conn
    });
  },

  tearDown: function () {
    this.conn = null;
    this.adapter = null;
  },

  testQueueSize: function () {
    var Assert = YAHOO.util.Assert,
        empty = function () {}, id;
    this.adapter.send("<test>", empty);
    Assert.areSame(1, this.adapter._callbackQueue.length);
    id = this.conn.recentlyRegistered;
    this.conn.triggerEvent(id, XC.Test.Packet.extendWithXML("<iq id=\"" + id + "\"/>").getNode());
    Assert.areSame(0, this.adapter._callbackQueue.length);

    this.adapter.send("<test>", empty);
    this.adapter.send("<test>", empty);
    id = this.conn.recentlyRegistered;
    this.conn.triggerEvent(id, XC.Test.Packet.extendWithXML("<iq id=\"" + id + "\"/>").getNode());
    Assert.areSame(1, this.adapter._callbackQueue.length);
  },

  testQueueLimit: function () {
    var Assert = YAHOO.util.Assert,
        empty = function () {};
    this.adapter.send("<test>", empty);

    for (var i = 1; i < 125; i++) {
      Assert.areSame(i > 100 ? 100 : i, this.adapter._callbackQueue.length);
      this.adapter.send("<test>", empty);
    }
    Assert.areSame(100, this.adapter._callbackQueue.length);
  }
});

XC.MockStropheConnection = XC.Base.extend({
  jid: 'mock@example.com',

  _handlers: {},
  recentlyRegistered: null,

  addHandler: function (callback, foo, bar, baz, event) {
    this.recentlyRegistered = event;
    this._handlers[event] = callback;
  },
  deleteHandler: function () {},

  connected: true,
  disconnecting: false,

  triggerEvent: function (event, response) {
    this._handlers[event](response);
  },

  _id: 0,
  getUniqueId: function () {
    return this._id++;
  },

  send: function () {}
});

YAHOO.tool.TestRunner.add(XC.Test.StropheAdapter);
