/*globals YAHOO */
XC.Test.XC_DOMHelper = new YAHOO.tool.TestCase({
  name: 'XC.XC_DOMHelper Tests',

  setUp: function() {
    var demoXML = "<foo bam='baz' plip='plop'>\
                      <bar>\
                        <value>1</value>\
                      </bar>\
                      <bar>\
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
