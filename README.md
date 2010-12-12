XC: XMMP Client Library
=======================

The XC Library is an [RFC 3920](http://xmpp.org/rfcs/rfc3920.html) and [RFC 3921](http://xmpp.org/rfcs/rfc3921.html) compliant XMPP Client library for JavaScript. In addition to the XMPP Core and XMPP IM specs, we also implement [Service Discovery](http://xmpp.org/extensions/xep-0030.html), [Chat State Notifications](http://xmpp.org/extensions/xep-0085.html), [vCards](http://xmpp.org/extensions/xep-0054.html), [Delayed Delivery](http://xmpp.org/extensions/xep-0203.html), and [Roster Item Exchange](http://xmpp.org/extensions/xep-0144.html).

Getting Started
---------------
The only requirement is having [V8](http://code.google.com/p/v8/) or [SpiderMonkey](http://www.mozilla.org/js/spidermonkey/) installed for JSLint cheking in the build process. They are not required to make the project, although they're recommended if you are contributing to the project.

    make src
    make doc

Overview
--------
This library is NOT a client side BOSH implementation. Use a BOSH JavaScript implementation like [Strophe](http://code.stanziq.com/strophe/) or [JSJaC](http://blog.jwchat.org/jsjac/) as the underlying BOSH connection and XC to do everything else.


     +-------------------------------------+
     |       Client Side Web Browser       |
     |                                     |
     |   +----------------------------+    |
     |   |                            |    |
     |   |  Application Javascript    |    |
     |   |                            |    |
     |   +----------------------------+    |
     |                 ^                   |
     |                 |                   |
     |                 v                   |
     |   +----------------------------+    |
     |   |                            |    |
     |   |             XC             |    |
     |   |                            |    |
     |   +----------------------------+    |
     |   |                            |    |
     |   |   JS XMPP Client Library   |    |
     |   |       (strophe/jsjac)      |    |
     |   +----------------------------+    |
     |                 ^                   |
     +---------------- | ------------------+
                       |
                   BOSH/HTTP(s)
    http://xmpp.org/extensions/xep-0124.html
                       |
                       v
         +----------------------------+
         |                            |
         |        XMPP Server         |
         |                            |
         +----------------------------+

Tests
-----
This library has been extensively tested. If you find any bugs, and would like to contribute, write a test making the condition fail, then fix the offending code. We're happy to have any contributors to the project.

XC has been tested (and has all tests passing) on the following platforms:

* FireFox 3.6, 4.0b
* Chrome 6
* Safari 5
* IE 8
* Opera 10

Examples
--------
For the examples to work properly they must be served from same domain as the bosh resource they are trying to connect to in order to avoid cross domain issues. If you're using Apache, this means adding:

    ProxyPass /http-bind http://location/to/your/bosh/http-bind
    ProxyPassReverse /http-bind http://location/to/your/bosh/http-bind

to your .conf file, and restarting Apache. If you go to http://localhost/http-bind, you should see something like "You really don't look like a BOSH client to me... what do you want?". Now, start up the example on your localhost, and check it out!

TODO
----

version 2 thought... instead of parsing out values into json, intead return objects that include the DOM node of the XMPP stanza and a list of XPaths for known elements that can be parsed out, this will allow the client library to lazily retrieve.

For example:

receive XML: 
 <message type='chat'>
   <body>Hi There</body>
   <foo xmlns="urn:foobar"><bar>value</bar></foo>
 </message>

creates object =>

msg = {
  doc: <a dom document>
  xpaths: {
    type: '/message/@type',
    body: '/message/body',
    foobar:foo: '/message/foo',
    foobar:bar: '/message/foo/bar'
  }
}

// KVO approach:

msg = {

  XPathReader: function () {
    return new DOMParser(this.get('doc'));
  }.cacheable(),

  type: XPathProperty.extend('/message/@type'),
  body: XPathProperty.extend('/message/body/text()'),

  // Handle all unknown lookups, assuming that they are XPath.
  unknownProperty: function (xpath) {
    return this.get('reader').getNodeValueFor(xpath);
  }
}

XC.Registrar.register('urn:foobar').as('foobar');

msg.get('type');
// -> "chat"

msg.get('/message/foobar:foo/foobar:bar/@text');
// -> "value"

This API would just be for reading incoming stanzas in XC,
not for creating outgoing stanzas.

We *could* have a cover so we can use the .set()
functionality to fool those into thinking that the API handled
that, but it isn't necessary, and is waay too confusing and
mixes two independant parts of the library.

This approach will be more maintainable and probably be
easier to test and extend (if done properly).

Ideally, the message class would look like:

XC.Message = XC.Stanza.extend({
  subject: '/message/subject/text()',
  body: '/message/body/text()',
  thread: '/message/thread/text()',
  parentThread: '/message/thread/@parent'
});

Hardly any work at all!

Also, we should make our code read like the RFC and XEPs
so we can reference compliance with it. Consumers of this
library still neeed to know the RFC, so we might be able
to get away with simplifying some aspects of the API,
distilling it to a very simple and standardized set of
calls for creating XMPP stanzas, erring on the side of
more flexibility and control over ease of use (however,
simplicity is a MUST). Ease of use is bonus work on top.
