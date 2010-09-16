/*globals YAHOO */
XC.Test.XC_DOMHelper = new YAHOO.tool.TestCase({
  name: 'XC.XC_DOMHelper Tests',

  setUp: function () {
    var demoXML = "<foo bam='baz' plip='plop'>\
                      <bar>\
                        <value xmlns='fi'>1</value>\
                      </bar>\
                      <bar xmlns='fi'>\
                        <value>2</value>\
                      </bar>\
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
        fiBar = XC_DOMHelper.getElementsByNS(foo, 'fi'),
        value = XC_DOMHelper.getElementsByNS(bar, 'fi'),
        empty = XC_DOMHelper.getElementsByNS(bar, 'foe');

    Assert.areEqual(1, fiBar.length, "Unexpected number of elements.");
    Assert.areEqual(1, value.length, "Unexpected number of elements.");
    Assert.areEqual(0, empty.length, "Unexpected number of elements.");

    Assert.areEqual('bar', fiBar[0].localName || fiBar[0].nodeName);
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
  }

});

YAHOO.tool.TestRunner.add(XC.Test.XC_DOMHelper);
