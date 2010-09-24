/*global YAHOO */
XC.Test.Service.VCard = new YAHOO.tool.TestCase({
  name: 'XC vCard Service Tests',

  setUp: function () {
    this.conn = XC.Test.MockConnection.extend().init();
    this.xc = XC.Connection.extend({connectionAdapter: this.conn});
  },

  tearDown: function () {
    delete this.conn;
    delete this.xc;
  },

  testVCardGet: function () {
    var Assert = YAHOO.util.Assert;

    this.conn.addResponse(XC.Test.Packet.extendWithXML(
"<iq id='v2' type='set'>\
  <vCard xmlns='vcard-temp'>\
    <FN>Peter Saint-Andre</FN>\
    <N>\
      <FAMILY>Saint-Andre</FAMILY>\
      <GIVEN>Peter</GIVEN>\
      <MIDDLE/>\
    </N>\
    <NICKNAME>stpeter</NICKNAME>\
    <URL>http://www.xmpp.org/xsf/people/stpeter.shtml</URL>\
    <BDAY>1966-08-06</BDAY>\
    <ORG>\
      <ORGNAME>XMPP Standards Foundation</ORGNAME>\
      <ORGUNIT/>\
    </ORG>\
    <TITLE>Executive Director</TITLE>\
    <ROLE>Patron Saint</ROLE>\
    <TEL><WORK/><VOICE/><NUMBER>303-308-3282</NUMBER></TEL>\
    <TEL><WORK/><FAX/><NUMBER/></TEL>\
    <TEL><WORK/><MSG/><NUMBER/></TEL>\
    <ADR>\
      <WORK/>\
      <EXTADD>Suite 600</EXTADD>\
      <STREET>1899 Wynkoop Street</STREET>\
      <LOCALITY>Denver</LOCALITY>\
      <REGION>CO</REGION>\
      <PCODE>80202</PCODE>\
      <CTRY>USA</CTRY>\
    </ADR>\
    <TEL><HOME/><VOICE/><NUMBER>303-555-1212</NUMBER></TEL>\
    <TEL><HOME/><FAX/><NUMBER/></TEL>\
    <TEL><HOME/><MSG/><NUMBER/></TEL>\
    <ADR>\
      <HOME/>\
      <EXTADD/>\
      <STREET/>\
      <LOCALITY>Denver</LOCALITY>\
      <REGION>CO</REGION>\
      <PCODE>80209</PCODE>\
      <CTRY>USA</CTRY>\
    </ADR>\
    <EMAIL><INTERNET/><PREF/><USERID>stpeter@jabber.org</USERID></EMAIL>\
    <JABBERID>stpeter@jabber.org</JABBERID>\
    <DESC>\
      Check out my blog at https://stpeter.im/\
    </DESC>\
  </vCard>\
</iq>"));

    var win = false, fail = false, that = this;
    this.xc.VCard.get({
      onSuccess: function (vCard) {
        win = true;
        Assert.isObject(vCard);
        Assert.areSame(vCard.namespaceURI, 'vcard-temp');
        Assert.areSame(vCard.localName ||
                       vCard.nodeName, 'vCard');
      },
      onError: function () {
        fail = true;
      }
    });

    Assert.isTrue(win);
    Assert.isFalse(fail);
  },

  testVCardGetXML: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          "<iq id='v3'\
               to='stpeter@jabber.org/roundabout'\
               type='result'>\
             <vCard xmlns='vcard-temp'/>\
          </iq>");

    this.conn.addResponse(packet);
    this.xc.VCard.get();

    Assert.XPathTests(this.conn.getLastStanzaXML(), {
      to: {
        xpath: '/iq/@to',
        value: undefined
      },
      vCard: {
        xpath: '/iq/vcard:vCard/node()',
        value: null,
        assert: function (nil, node) {
          Assert.isNotNull(node);
        }
      }
    });
  },

  testVCardGetError: function () {
    var Assert = YAHOO.util.Assert,
        packet = XC.Test.Packet.extendWithXML(
          "<iq id='v3'\
               to='stpeter@jabber.org/roundabout'\
               type='error'>\
             <vCard xmlns='vcard-temp'/>\
             <error type='cancel'>\
               <service-unavailable xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/>\
             </error>\
          </iq>");
    
    this.conn.addResponse(packet);

    var win = false, fail = false;
    this.xc.VCard.get({
      onSuccess: function (entity) {
        win = true;
      },
      onError: function (pkt) {
        fail = true;
        Assert.areSame(packet, pkt);
      }
    });

    Assert.isTrue(fail);
    Assert.isFalse(win);
  }

});

YAHOO.tool.TestRunner.add(XC.Test.Service.VCard);
