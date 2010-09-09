/*globals YAHOO*/
XC.Test.Mixin.Discoverable = new YAHOO.tool.TestCase({
  name: 'XC Discoverable Tests',

  ran: false,
  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
    this.xc.initConnection();

    this.Disco = this.xc.Disco;
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testAddFeature: function () {
    var Assert = YAHOO.util.Assert;

    this.Disco.addFeature('magic');
    this.Disco.addFeature('unicorns', 'subnode');
    Assert.areNotEqual(-1, this.Disco.getFeatures().indexOf('magic'),
                       "The feature 'magic' was not added.");
    Assert.areNotEqual(-1, this.Disco.getFeatures('subnode').indexOf('unicorns'),
                       "The feature 'unicorns' was not added to the node 'subnode'.");
  },

  testRemoveFeature: function () {
    var Assert = YAHOO.util.Assert;

    Assert.areNotEqual(-1, this.Disco.getFeatures().indexOf('magic'),
                       "The feature 'magic' does not exist.");
    this.Disco.removeFeature('magic');
    Assert.areEqual(-1, this.Disco.getFeatures().indexOf('magic'),
                    "The feature 'magic' was not removed.");

    Assert.areNotEqual(-1, this.Disco.getFeatures('subnode').indexOf('unicorns'),
                       "The feature 'magic' does not exist on node 'subnode'.");
    this.Disco.removeFeature('unicorns', 'subnode');
    Assert.areEqual(-1, this.Disco.getFeatures('subnode').indexOf('unicorns'),
                    "The feature 'unicorns' was not removed from the node 'subnode'.");
  },

  testAddIdentity: function () {
    var Assert = YAHOO.util.Assert,
        jnx = {category: 'client',
               type: 'web',
               name: 'JNX'},
        muc = {category: 'conference',
               type: 'text'};

    this.Disco.addIdentity(jnx);
    this.Disco.addIdentity(muc, 'conference');
    Assert.areNotEqual(-1, this.Disco.getIdentities().indexOf(jnx),
                       "The identity 'JNX' was not added.");

    Assert.areNotEqual(-1, this.Disco.getIdentities('conference').indexOf(muc),
                       "The identity 'muc' was not added to the 'conference' node.");
  },

  testRemoveIdentity: function () {
    var Assert = YAHOO.util.Assert,
        jnx = this.Disco.getIdentities()[0],
        muc = this.Disco.getIdentities('conference')[0];

    Assert.areNotEqual(-1, this.Disco.getIdentities().indexOf(jnx),
                       "The identity 'JNX' does not exist.");
    this.Disco.removeIdentity(jnx);
    Assert.areEqual(-1, this.Disco.getIdentities().indexOf(jnx),
                    "The identity 'JNX' was not removed.");

    Assert.areNotEqual(-1, this.Disco.getIdentities('conference').indexOf(muc),
                       "The identity 'muc' does not exist on the conference node.");
    this.Disco.removeIdentity(muc, 'conference');
    Assert.areEqual(-1, this.Disco.getIdentities('conference').indexOf(muc),
                    "The identity 'muc' was not removed from the 'conference' node");

  },

  testAddItem: function () {
    var Assert = YAHOO.util.Assert,
        nil = {jid: this.conn.jid(),
               node: '0',
               name: 'nil'},
        iPod = {jid: 'pubsub.montague.net',
                node: 'music/R/Romeo/iPod',
                name: 'Romeo\'s playlist'};

    this.Disco.addItem(nil);
    this.Disco.addItem(iPod, 'http://jabber.org/protocol/tune');
    Assert.areNotEqual(-1, this.Disco.getItems().indexOf(nil),
                       "The item 'nil' was not added.");
    Assert.areNotEqual(-1, this.Disco.getItems('http://jabber.org/protocol/tune').indexOf(iPod),
                       "The item 'nil' was not added.");
  },

  testRemoveItem: function () {
    var Assert = YAHOO.util.Assert,
        nil = this.Disco.getItems()[0],
        iPod = this.Disco.getItems('http://jabber.org/protocol/tune')[0];

    Assert.areNotEqual(-1, this.Disco.getItems().indexOf(nil),
                       "The item 'nil' does not exist.");
    this.Disco.removeItem(nil);
    Assert.areEqual(-1, this.Disco.getItems().indexOf(nil),
                       "The item 'nil' was not removed.");

    Assert.areNotEqual(-1, this.Disco.getItems('http://jabber.org/protocol/tune').indexOf(iPod),
                       "The item 'iPod' does not exist on the node 'http://jabber.org/protocol/tune'.");
    this.Disco.removeItem(iPod, 'http://jabber.org/protocol/tune');
    Assert.areEqual(-1, this.Disco.getItems('http://jabber.org/protocol/tune').indexOf(iPod),
                       "The item 'iPod' was not removed from the node 'http://jabber.org/protocol/tune'.");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Mixin.Discoverable);
