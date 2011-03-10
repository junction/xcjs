/*globals YAHOO */
XC.Test.PrivateStorage = new YAHOO.tool.TestCase({
  name: 'XC Private Storage Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isObject(XC.Service.PrivateStorage, "PrivateStorage is not available.");
    Assert.areSame(this.xc, this.xc.PrivateStorage.connection, 'connection and service connection are not the same');
  },

  testGetOutgoingXML: function () {
    var Assert = YAHOO.util.Assert;
    var xml = '<iq to="' + this.conn.jid() + '" type="result">' +
                '<query xmlns="jabber:iq:private">' +
                  '<recipes xmlns="chef:cookbook">' +
                     '<recipe>' +
                       '<title>Doughnuts</title>' +
                       '<instructions>' +
                         '<step no="1">Throw english muffin in air.</step>' +
                         '<step no=2">Fire gun at english muffin.</step>' +
                       '</instructions>' +
                     '</recipe>' +
                  '</recipes>' +
                '</query>' +
              '</iq>';

        
    this.conn.addResponse(XC.Test.Packet.extendWithXML(xml));

    var success = false, fail = false;
    this.xc.PrivateStorage.get("recipes", "chef:cookbook", {
      onSuccess: function (xml) {
        success = true;
      },
      onError: function (packet) {
        fail = true;
      }
    });

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/client:iq/@to',
        value: undefined
      },
      type: {
        xpath: '/client:iq/@type',
        value: 'get'
      },
      recipes: {
        xpath: '/client:iq/private:query/cookbook:recipes',
        value: null,
        assert: function (val, nodeVal, message, node) {
          Assert.isObject(node, arguments[2]);
        }
      }
    });

    Assert.isTrue(success);
    Assert.isFalse(fail);
  },

  testGetResult: function () {
    var Assert = YAHOO.util.Assert;
    var xml = '<iq to="' + this.conn.jid() + '" type="result">' +
                '<query xmlns="jabber:iq:private">' +
                  '<recipes xmlns="chef:cookbook">' +
                     '<recipe>' +
                       '<title>Doughnuts</title>' +
                       '<instructions>' +
                         '<step no="1">Throw english muffin in air.</step>' +
                         '<step no=2">Fire gun at english muffin.</step>' +
                       '</instructions>' +
                     '</recipe>' +
                  '</recipes>' +
                '</query>' +
              '</iq>';

        
    this.conn.addResponse(XC.Test.Packet.extendWithXML(xml));

    var success = false, fail = false;
    this.xc.PrivateStorage.get("recipes", "chef:cookbook", {
      onSuccess: function (xml) {
        success = true;
        Assert.areEqual('recipes', xml.tagName);
      },
      onError: function (packet) {
        fail = true;
      }
    });

    Assert.isTrue(success);
    Assert.isFalse(fail);
  },

  testGetError: function () {
    var Assert = YAHOO.util.Assert;
    var xml = '<iq to="' + this.conn.jid() + '" type="error">' +
                '<query xmlns="jabber:iq:private">' +
                  '<recipes xmlns="chef:cookbook"/>' +
                '</query>' +
              '</iq>';

        
    this.conn.addResponse(XC.Test.Packet.extendWithXML(xml));

    var success = false, fail = false;
    this.xc.PrivateStorage.get("recipes", "chef:cookbook", {
      onSuccess: function (xml) {
        success = true;
      },
      onError: function (packet) {
        fail = true;
        Assert.isObject(packet);
      }
    });

    Assert.isTrue(fail);
    Assert.isFalse(success);
  },

  testSetOutgoingXML: function () {
    var Assert = YAHOO.util.Assert;
    var xml = '<iq to="' + this.conn.jid() + '" type="result">' +
                '<query xmlns="jabber:iq:private">' +
                  '<recipes xmlns="chef:cookbook"/>' +
                '</query>' +
              '</iq>';

        
    this.conn.addResponse(XC.Test.Packet.extendWithXML(xml));
    var success = false, fail = false;
    this.xc.PrivateStorage.set("recipes", "chef:cookbook", [{
      name: 'recipe',
      children: [{
        name: 'title',
        text: 'Chocolate Moose'
      }, {
        name: 'author',
        text: 'Swedish Chef'
      }, {
        name: 'instructions',
        children: [{
          name: 'step',
          attrs: { 'no': 1 },
          text: 'Get chocolate.'
        }, {
          name: 'step',
          attrs: { 'no': 2 },
          text: 'Get a moose.'
        }, {
          name: 'step',
          attrs: { 'no': 3 },
          text: 'Put the chocolate on the moose.'
        }]
      }]      
    }], {
      onSuccess: function (xml) {
        success = true;
      },
      onError: function (packet) {
        fail = true;
      }
    });

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/client:iq/@to',
        value: undefined
      },
      type: {
        xpath: '/client:iq/@type',
        value: 'set'
      },
      recipe_title: {
        xpath: '/client:iq/private:query/cookbook:recipes/cookbook:recipe/cookbook:title/text()',
        value: 'Chocolate Moose'
      },
      recipe_author: {
        xpath: '/client:iq/private:query/cookbook:recipes/cookbook:recipe/cookbook:author/text()',
        value: 'Swedish Chef'
      },
      recipe_instructions: {
        xpath: '/client:iq/private:query/cookbook:recipes/cookbook:recipe/cookbook:instructions',
        value: null,
        assert: function (val, nodeVal, message, node) {
          Assert.isObject(node, arguments[2]);
        }
      }
    });

    Assert.isTrue(success);
    Assert.isFalse(fail);
  },

  testSetError: function () {
    var Assert = YAHOO.util.Assert;
    var xml = '<iq to="' + this.conn.jid() + '" type="error">' +
                '<query xmlns="jabber:iq:private">' +
                  '<recipes xmlns="chef:cookbook">' +
                    '<recipe>' +
                      '<title>Chocolate Moose</title>' +
                      '<author>Swedish Chef</author>' +
                      '<instructions>' +
                        '<step no="1">Get chocolate.</step>' +
                        '<step no="2">Get a moose.</step>' +
                        '<step no="3">Put the chocolate on the moose.</step>' +
                      '</instructions>' +
                    '</recipe>' +
                  '</recipes>' +
                '</query>' +
              '</iq>';
        
    this.conn.addResponse(XC.Test.Packet.extendWithXML(xml));

    var success = false, fail = false;
    this.xc.PrivateStorage.set("recipes", "chef:cookbook", [{
      name: 'recipe',
      children: [{
        name: 'title',
        text: 'Chocolate Moose'
      }, {
        name: 'author',
        text: 'Swedish Chef'
      }, {
        name: 'instructions',
        children: [{
          name: 'step',
          attrs: { 'no': 1 },
          text: 'Get chocolate.'
        }, {
          name: 'step',
          attrs: { 'no': 2 },
          text: 'Get a moose.'
        }, {
          name: 'step',
          attrs: { 'no': 3 },
          text: 'Put the chocolate on the moose.'
        }]
      }]      
    }], {
      onSuccess: function (xml) {
        success = true;
      },
      onError: function (packet) {
        fail = true;
        Assert.isObject(packet);
      }
    });

    Assert.isTrue(fail);
    Assert.isFalse(success);
  }

});

YAHOO.tool.TestRunner.add(XC.Test.PrivateStorage);
