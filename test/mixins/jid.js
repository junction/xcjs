/*globals YAHOO */
XC.Test.JID = new YAHOO.tool.TestCase({
  name: 'XC.Mixin.JID',

  setUp: function () {
    this.fullJID = XC.Base.extend(XC.Mixin.JID, {
      jid: 'homer@evergreen.terrace/742'
    });
    this.bareJID = XC.Base.extend(XC.Mixin.JID, {
      jid: 'marge@springfield.us'
    });
    this.fullDomainJID = XC.Base.extend(XC.Mixin.JID, {
      jid: 'springfield.us/elementary'
    });
    this.bareDomainJID = XC.Base.extend(XC.Mixin.JID, {
      jid: 'springfield.us'
    });
  },

  tearDown: function () {
    delete this.fullJID;
    delete this.bareJID;
    delete this.fullDomainJID;
    delete this.bareDomainJID;
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isObject(XC.Mixin.JID, 'XC.mixin.JID is not an object');
  },

  testGetBareJID: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.Mixin.JID.getBareJID, 'getBareJID is not a function');

    Assert.areEqual("homer@evergreen.terrace", this.fullJID.getBareJID(), "fullJID's bare JID is incorrect");
    Assert.areEqual("marge@springfield.us", this.bareJID.getBareJID(), "bareJID's bare JID is incorrect");
    Assert.areEqual("springfield.us", this.fullDomainJID.getBareJID(), "fullDomain's bare JID is incorrect");
    Assert.areEqual("springfield.us", this.bareDomainJID.getBareJID(), "bareDomain's bare JID is incorrect");
  },

  testGetJIDDomain: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.Mixin.JID.getJIDDomain, "getJIDDomain is not a function");

    Assert.areEqual("evergreen.terrace", this.fullJID.getJIDDomain(), "fullJID's domain is incorrect");
    Assert.areEqual("springfield.us", this.bareJID.getJIDDomain(), "bareJID's domain is incorrect");
    Assert.areEqual("springfield.us", this.fullDomainJID.getJIDDomain(), "fullDomain's domain is incorrect");
    Assert.areEqual("springfield.us", this.bareDomainJID.getJIDDomain(), "bareDomain's domain is incorrect");
  },

  testGetJIDResource: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.Mixin.JID.getJIDResource, "getJIDResource is not a function");

    Assert.areEqual("742", this.fullJID.getJIDResource(), "JID resource is incorrect");
    Assert.isNull(this.bareJID.getJIDResource(), "bareJID resource is incorrect");
    Assert.areEqual("elementary", this.fullDomainJID.getJIDResource(), "fullDomain's resource is incorrect");
    Assert.isNull(this.bareDomainJID.getJIDResource(), "bareDomainJID resource is incorrect");
  },

  testGetJIDNode: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.Mixin.JID.getJIDNode, "getJIDNode is not a function");

    Assert.areEqual("homer", this.fullJID.getJIDNode(), "fullJID node is incorrect");
    Assert.areEqual("marge", this.bareJID.getJIDNode(), "bareJID node is incorrect");
    Assert.isNull(this.fullDomainJID.getJIDNode(), "fullDomain JID node is incorrect");
    Assert.isNull(this.bareDomainJID.getJIDNode(), "bareDomain JID node is incorrect");
  }

});

YAHOO.tool.TestRunner.add(XC.Test.JID);
