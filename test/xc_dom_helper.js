/*globals YAHOO */
XC.Test.XC_DOMHelper = new YAHOO.tool.TestCase({
  name: 'XC.XC_DOMHelper Tests',

  setUp: function () {
    var demoXML = "\
      <foo bam='baz' plip='plop'>\
        <bar>\
          <value xmlns='fi'>1</value>\
        </bar>\
        <bar xmlns='fi'>\
          <value>2</value>\
        </bar>\
        <bill xmlns='fi'/>\
      </foo>";
    this.demoDoc = XC.Test.DOMParser.parse(demoXML).doc;
  },

  tearDown: function() {
    delete this.demoDoc;
  },

  testGetFirstElementChild: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC_DOMHelper.getFirstElementChild, 'getFirstElementChild is not a function');

    var foo = XC_DOMHelper.getFirstElementChild(this.demoDoc),
      bar = XC_DOMHelper.getFirstElementChild(foo);

    Assert.areEqual('foo', foo.nodeName);
    Assert.areEqual('bar', bar.nodeName);
  },

  testGetElementByNamespace: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC_DOMHelper.getElementsByNS, 'getElementsByNS is not a function');

    var foo = XC_DOMHelper.getFirstElementChild(this.demoDoc),
        bar = XC_DOMHelper.getFirstElementChild(foo),
        barBill = XC_DOMHelper.getElementsByNS(foo, 'fi'),
        value = XC_DOMHelper.getElementsByNS(bar, 'fi'),
        empty = XC_DOMHelper.getElementsByNS(bar, 'foe');

    Assert.areEqual(2, barBill.length, "Unexpected number of elements.");
    Assert.areEqual(1, value.length, "Unexpected number of elements.");
    Assert.areEqual(0, empty.length, "Unexpected number of elements.");

    Assert.areEqual('bar', barBill[0].localName || barBill[0].nodeName);
    Assert.areEqual('bill', barBill[1].localName || barBill[1].nodeName);
    Assert.areEqual('1', XC_DOMHelper.getTextContent(value[0]), "value should be '1'");
  },

  testGetTextContent: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC_DOMHelper.getTextContent, 'getTextContent is not a function');

    var foo = XC_DOMHelper.getFirstElementChild(this.demoDoc),
        bar = XC_DOMHelper.getFirstElementChild(foo),
        val = XC_DOMHelper.getFirstElementChild(bar);

    Assert.areEqual("1",XC_DOMHelper.getTextContent(val),'val should be 1');
    Assert.isString(XC_DOMHelper.getTextContent(bar), 'bar text should be a string');
    Assert.areEqual("1",XC_DOMHelper.getTextContent(bar).replace(/(\s)*/g,''), 'bar (replaced) should be 1');
    Assert.areEqual("12",XC_DOMHelper.getTextContent(foo).replace(/(\s)*/g,''), 'foo (replaced) should be 12');
  },

  testSetTextContent: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC_DOMHelper.setTextContent, 'setTextContent is not a function');

    var foo = XC_DOMHelper.getFirstElementChild(this.demoDoc);
        bar = XC_DOMHelper.getFirstElementChild(foo);

    XC_DOMHelper.setTextContent(bar, "new text");
    Assert.areEqual("new text", XC_DOMHelper.getTextContent(bar));

    XC_DOMHelper.setTextContent(bar, "blah!");
    Assert.areEqual("blah!", XC_DOMHelper.getTextContent(bar));
  },

  testSerializeToString: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC_DOMHelper.serializeToString, 'serializeToString is not a function');

    Assert.XPathTests(XC_DOMHelper.serializeToString(this.demoDoc), {
      bam: {
        xpath: '/foo/@bam',
        value: 'baz'
      },
      plip: {
        xpath: '/foo/@plip',
        value: 'plop'
      },
      bar: {
        xpath: '/foo/bar/fi:value/text()',
        value: '1'
      },
      bar_fi: {
        xpath: '/foo/fi:bar/fi:value/text()',
        value: '2'
      }
    });
  },

  testCreateElementNS: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC_DOMHelper.createElementNS, 'createElementNS is not a function');

    var dummy = XC_DOMHelper.createElementNS('fi', 'dummy');
    Assert.areEqual('fi', dummy.namespaceURI);
    Assert.areEqual('dummy', dummy.localName || dummy.nodeName);

    var foo = XC_DOMHelper.getFirstElementChild(this.demoDoc),
        bill = XC_DOMHelper.getElementsByNS(foo, 'fi')[1];

    bill = XC_DOMHelper.importNode(bill, true);
    bill.appendChild(dummy);

    Assert.areEqual(dummy, XC_DOMHelper.getFirstElementChild(bill));
  },

  testImportNode: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(XC_DOMHelper.importNode, 'importNode is not a function');

    Assert.XPathTests(XC_DOMHelper.serializeToString(XC_DOMHelper.importNode(this.demoDoc.firstChild, true)), {
      bam: {
        xpath: '/foo/@bam',
        value: 'baz'
      },
      plip: {
        xpath: '/foo/@plip',
        value: 'plop'
      },
      bar: {
        xpath: '/foo/bar/fi:value/text()',
        value: '1'
      },
      bar_fi: {
        xpath: '/foo/fi:bar/fi:value/text()',
        value: '2'
      }
    });
  }

});

YAHOO.tool.TestRunner.add(XC.Test.XC_DOMHelper);
