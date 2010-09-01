/*globals YAHOO */
XC.Test.XML = new YAHOO.tool.TestCase({
  name: 'XC.XML Tests',

  setUp: function () {
    this.demoXML = "<foo bam='baz' plip='plop'>\
                      <bar>\
                        <value>1</value>\
                      </bar>\
                      <bar>\
                        <value>2</value>\
                      </bar>\
                    </foo>";
    this.demoDoc = XC.Test.DOMParser.parse(this.demoXML);

    this.iqXML = '<iq to="testTo@sender.com" from="testFrom@receiver.com">\
                     <command xmlns="http://jabber.org/protocol/commands" action="execute" node="foo">\
                       <x xmlns="jabber:x:data" type="submit">\
                         <field var="f1">\
                           <value>f1Value</value>\
                         </field>\
                         <field var="f2">\
                           <value>f2Value</value>\
                         </field>\
                       </x>\
                     </command>\
                   </iq>';
    this.iqDoc = XC.Test.DOMParser.parse(this.iqXML);
  },

  tearDown: function () {
    delete this.demoXML;
    delete this.demoDoc;
    delete this.iqXML;
    delete this.iqDoc;
  },

  testXMLNamespaces: function () {
    var Assert = YAHOO.util.Assert;

    Assert.isObject(XC.XML, 'XC.XML not found');
    Assert.isObject(XC.XML.Element, 'XC.XML.Element not found');
    Assert.isObject(XC.XMPP, 'XC.XMPP not found');
    Assert.isObject(XC.XMPP.Stanza, 'XC.XMPP.Stanza not found');
    Assert.isObject(XC.XMPP.IQ, 'XC.XMPP.IQ not found');
    Assert.isObject(XC.XMPP.Presence, 'XC.XMPP.Presence not found');
    Assert.isObject(XC.XMPP.Query, 'XC.XMPP.Query not found');
    Assert.isObject(XC.XMPP.Message, 'XC.XMPP.Message not found');
    Assert.isObject(XC.XMPP.Command, 'XC.XMPP.Command not found');
    Assert.isObject(XC.XMPP.XDataForm, 'XC.XMPP.XDataForm not found');
  },

  testXMLAPI: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.XML.Element.addChild, 'addChild is not a function');
    Assert.isFunction(XC.XML.Element.attr, 'attr is not a function');
    Assert.isFunction(XC.XML.Element.toString, 'toString is not a function');
    Assert.isFunction(XC.XML.Element.create, 'create is not a function');
  },

  testXMLElement: function () {
    var Assert = YAHOO.util.Assert;

    var typeOfElement = XC.XML.Element.extend({name: 'test'});

    var extendedElement = typeOfElement.extend();
    extendedElement.attr('bam', 'bop');
    Assert.areEqual('bop', extendedElement.attr('bam'));
    Assert.isUndefined(extendedElement.attr('bop'));

    //
    // test XC.XML.Element.create
    //
    var createdAttrs = {foo: 'bar', baz: 'bam'};
    var createdChild = XC.XML.Element.extend({name: 'child', text: 'the text'});
    var createdElement = typeOfElement.create(createdAttrs, [createdChild]);

    Assert.areEqual('bar', createdElement.attr('foo'));
    Assert.areEqual('test', createdElement.name);

    var doc = XC.Test.DOMParser.parse(createdElement.convertToString());
    Assert.areEqual('the text', doc.getPathValue('/test/child/text()'));

    var createdElement2 = typeOfElement.create(createdAttrs, createdChild);
    Assert.areEqual(createdElement.convertToString(), createdElement2.convertToString());
  },

  testDemoXMLStructure: function () {
    var Assert = YAHOO.util.Assert;
    var foo = XC.XML.Element.extend({name: 'foo'}),
        bar = XC.XML.Element.extend({name: 'bar'}),
        bar2 = XC.XML.Element.extend({name: 'bar'}),
        value = XC.XML.Element.extend({name: 'value', text: 1}),
        value2 = XC.XML.Element.extend({name: 'value', text: 2});

    foo.addChild(bar);
    foo.addChild(bar2);
    bar.addChild(value);
    bar2.addChild(value2);
    foo.attr('bam', 'baz');
    foo.attr('plip', 'plop');

    //
    // test attr() and text
    //
    Assert.areEqual('baz', foo.attr('bam'));
    Assert.areEqual(this.demoDoc.getPathValue('/foo/@bam'), foo.attr('bam'));
    Assert.areEqual(this.demoDoc.getPathValue('/foo/@plip'), foo.attr('plip'));
    Assert.areEqual(this.demoDoc.getPathValue('/foo/bar[1]/value/text()'), value.text);
    Assert.areEqual(this.demoDoc.getPathValue('/foo/bar[2]/value/text()'), value2.text);
  },

  testIQStructure: function () {
    var Assert = YAHOO.util.Assert;
    var iq = XC.XMPP.IQ.extend(),
        body = XC.XML.Element.extend({name: 'garbage', text: 'text'});

    iq.to('testTo@sender.com');
    iq.from('testFrom@receiver.com');
    iq.addChild(body);

    Assert.isFunction(iq.to);
    Assert.isFunction(iq.from);

    //
    // test values
    //
    Assert.areEqual('testTo@sender.com', iq.attr('to'), 'str not equal to iq.attr("to")');
    Assert.areEqual('testFrom@receiver.com', iq.attr('from'), 'str not equal to iq.attr("from")');

    //
    // test attr aliases
    //
    Assert.areEqual(iq.attr('to'), iq.to(), 'iq.attr(to) != iq.to()');
    Assert.areEqual(iq.attr('from'), iq.from(), 'iq.attr(from) != iq.from()');

    //
    // test DOM structure xpath
    //
    var doc = XC.Test.DOMParser.parse(iq.convertToString());
    Assert.areEqual(iq.to(),
                    doc.getPathValue('/iq/@to'),
                    "xpath not equal to iq.to()");
    Assert.areEqual(iq.from(),
                    doc.getPathValue('/iq/@from'),
                    "xpath not equal to iq.from()");
  },

  testQueryStructure: function () {
    var Assert = YAHOO.util.Assert,
        q = XC.XMPP.Query.extend();
    
    Assert.areEqual('query', q.name, 'query element name is incorrect');
  },

  testPresenceStructur: function () {
    var Assert = YAHOO.util.Assert,
        p = XC.XMPP.Presence.extend();

    Assert.areEqual('presence', p.name, 'presence element name is incorrect');
  },

  testPubSubStructure: function () {
    var Assert = YAHOO.util.Assert;
    var p = XC.XMPP.PubSub.extend();

    Assert.areEqual("pubsub", p.name, 'pubsub element name is incorrect');
    Assert.areEqual("http://jabber.org/protocol/pubsub", p.xmlns, 'pubsub namespace is incorrect');
  },

  testCommandAPI: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.XMPP.Command.node);
    Assert.isFunction(XC.XMPP.Command.action);
  },

  testCommandStructure: function () {
    var Assert = YAHOO.util.Assert;
    var iq = XC.XMPP.IQ.extend(),
      cmd = XC.XMPP.Command.extend();

    iq.addChild(cmd);
    cmd.node("foo");
    cmd.action("execute");

    //
    // test xmlns
    //
    Assert.areEqual("http://jabber.org/protocol/commands", cmd.xmlns, 'command namespace incorrect');

    //
    // test attr aliases
    //
    Assert.areEqual("foo", cmd.node(), "string:foo not equal to cmd.node()");
    Assert.areEqual("execute", cmd.action(), "string:execute not equal to cmd.action()");

    //
    // test DOM structure xpath
    //
    var doc = XC.Test.DOMParser.parse(iq.convertToString());
    Assert.areEqual(cmd.node(),
                    doc.getPathValue('/iq/cmd:command/@node'),
                    "xpath not equal to cmd.node()");
    Assert.areEqual(cmd.action(),
                    doc.getPathValue('/iq/cmd:command/@action'),
                    "xpath not equal to cmd.action()");
  },

  testXDataFormAPI: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC.XMPP.XDataForm.type, 'type is not a function');
    Assert.isFunction(XC.XMPP.XDataForm.addField, 'addField is not a function');
  },

  testXDataFormStructure: function () {
    var Assert = YAHOO.util.Assert;
    var iq = XC.XMPP.IQ.extend(),
      cmd = XC.XMPP.Command.extend(),
      x = XC.XMPP.XDataForm.extend();

    iq.addChild(cmd);
    cmd.node("foo");
    cmd.action("execute");
    cmd.addChild(x);

    x.type('submit');
    x.addField('f1', 'f1Value');
    x.addField('f2', 'f2Value');

    //
    // test xmlns
    //
    Assert.areEqual("jabber:x:data", x.xmlns, 'x namesapce incorrect');

    //
    // test attr aliases
    //
    Assert.areEqual("submit", x.type(), "string:submit not equal to x.type()");

    //
    // test DOM structure xpath
    //
    var doc = XC.Test.DOMParser.parse(iq.convertToString());
    Assert.areEqual(x.type(),
                    doc.getPathValue('/iq/cmd:command/x:x/@type'),
                    "xpath not equal to x.type()");
    Assert.areEqual('f1Value',
                    doc.getPathValue('/iq/cmd:command/x:x/x:field[@var="f1"]/x:value/text()'));
    Assert.areEqual('f2Value',
                    doc.getPathValue('/iq/cmd:command/x:x/x:field[@var="f2"]/x:value/text()'));

  }
});

YAHOO.tool.TestRunner.add(XC.Test.XML);
