/*globals YAHOO*/
XC.Test.Mixin.Discoverable = new YAHOO.tool.TestCase({
  name: 'XC Discoverable Tests',

  ran: false,
  setUp: function () {
    this.conn = XC.Test.MockConnection.extend();
    this.DiscoverableService = XC.Base.extend(XC.Mixin.Discoverable, {
      connection: XC.Connection.extend({connectionAdapter: this.conn})
    });
  },

  tearDown: function () {
    delete this.conn;
    delete this.DiscoverableService;
  },

  testAddFeature: function () {
    var Assert = YAHOO.util.Assert;

    this.DiscoverableService.addFeature('magic');
    this.DiscoverableService.addFeature('unicorns', 'subnode');
    Assert.areNotEqual(-1, this.DiscoverableService.getFeatures().indexOf('magic'),
                       "The feature 'magic' was not added.");
    Assert.areNotEqual(-1, this.DiscoverableService.getFeatures('subnode').indexOf('unicorns'),
                       "The feature 'unicorns' was not added to the node 'subnode'.");
  },

  testRemoveFeature: function () {
    var Assert = YAHOO.util.Assert;

    this.DiscoverableService.addFeature('magic');
    Assert.areNotEqual(-1, this.DiscoverableService.getFeatures().indexOf('magic'),
                       "The feature 'magic' does not exist.");
    this.DiscoverableService.removeFeature('magic');
    Assert.areEqual(-1, this.DiscoverableService.getFeatures().indexOf('magic'),
                    "The feature 'magic' was not removed.");

    this.DiscoverableService.addFeature('unicorns', 'subnode');
    Assert.areNotEqual(-1, this.DiscoverableService.getFeatures('subnode').indexOf('unicorns'),
                       "The feature 'magic' does not exist on node 'subnode'.");
    this.DiscoverableService.removeFeature('unicorns', 'subnode');
    Assert.areEqual(-1, this.DiscoverableService.getFeatures('subnode').indexOf('unicorns'),
                    "The feature 'unicorns' was not removed from the node 'subnode'.");
  },

  testAddIdentity: function () {
    var Assert = YAHOO.util.Assert,
        jnx = {category: 'client',
               type: 'web',
               name: 'JNX'},
        muc = {category: 'conference',
               type: 'text'};

    this.DiscoverableService.addIdentity(jnx);
    this.DiscoverableService.addIdentity(muc, 'conference');
    Assert.areNotEqual(-1, this.DiscoverableService.getIdentities().indexOf(jnx),
                       "The identity 'JNX' was not added.");

    Assert.areNotEqual(-1, this.DiscoverableService.getIdentities('conference').indexOf(muc),
                       "The identity 'muc' was not added to the 'conference' node.");
  },

  testRemoveIdentity: function () {
    var Assert = YAHOO.util.Assert,
        jnx = {category: 'client',
               type: 'web',
               name: 'JNX'},
        muc = {category: 'conference',
               type: 'text'};

    this.DiscoverableService.addIdentity(jnx);
    this.DiscoverableService.addIdentity(muc, 'conference');

    var jnxIdent = this.DiscoverableService.getIdentities()[0],
      mucIdent = this.DiscoverableService.getIdentities('conference')[0];

    Assert.areNotEqual(-1, this.DiscoverableService.getIdentities().indexOf(jnxIdent),
                       "The identity 'JNX' does not exist.");
    this.DiscoverableService.removeIdentity(jnx);
    Assert.areEqual(-1, this.DiscoverableService.getIdentities().indexOf(jnxIdent),
                    "The identity 'JNX' was not removed.");

    Assert.areNotEqual(-1, this.DiscoverableService.getIdentities('conference').indexOf(mucIdent),
                       "The identity 'muc' does not exist on the conference node.");
    this.DiscoverableService.removeIdentity(muc, 'conference');
    Assert.areEqual(-1, this.DiscoverableService.getIdentities('conference').indexOf(mucIdent),
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

    this.DiscoverableService.addItem(nil);
    this.DiscoverableService.addItem(iPod, 'http://jabber.org/protocol/tune');
    Assert.areNotEqual(-1, this.DiscoverableService.getItems().indexOf(nil),
                       "The item 'nil' was not added.");
    Assert.areNotEqual(-1, this.DiscoverableService.getItems('http://jabber.org/protocol/tune').indexOf(iPod),
                       "The item 'nil' was not added.");
  },

  testRemoveItem: function () {
    var Assert = YAHOO.util.Assert,
        nil = {jid: this.conn.jid(),
               node: '0',
               name: 'nil'},
        iPod = {jid: 'pubsub.montague.net',
                node: 'music/R/Romeo/iPod',
                name: 'Romeo\'s playlist'};

    this.DiscoverableService.addItem(nil);
    this.DiscoverableService.addItem(iPod, 'http://jabber.org/protocol/tune');

    var
        nilItem = this.DiscoverableService.getItems()[0],
        iPodItem = this.DiscoverableService.getItems('http://jabber.org/protocol/tune')[0];

    Assert.areNotEqual(-1, this.DiscoverableService.getItems().indexOf(nilItem),
                       "The item 'nil' does not exist.");
    this.DiscoverableService.removeItem(nilItem);
    Assert.areEqual(-1, this.DiscoverableService.getItems().indexOf(nilItem),
                       "The item 'nil' was not removed.");

    Assert.areNotEqual(-1, this.DiscoverableService.getItems('http://jabber.org/protocol/tune').indexOf(iPodItem),
                       "The item 'iPod' does not exist on the node 'http://jabber.org/protocol/tune'.");
    this.DiscoverableService.removeItem(iPodItem, 'http://jabber.org/protocol/tune');
    Assert.areEqual(-1, this.DiscoverableService.getItems('http://jabber.org/protocol/tune').indexOf(iPodItem),
                       "The item 'iPod' was not removed from the node 'http://jabber.org/protocol/tune'.");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Mixin.Discoverable);
