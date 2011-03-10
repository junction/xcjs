XC: XMMP Client Library
=======================

The XC Library is an [RFC 3920](http://xmpp.org/rfcs/rfc3920.html) and [RFC 3921](http://xmpp.org/rfcs/rfc3921.html) compliant XMPP Client library for JavaScript. In addition to the XMPP Core and XMPP IM specs, we also implement [Service Discovery](http://xmpp.org/extensions/xep-0030.html), [Chat State Notifications](http://xmpp.org/extensions/xep-0085.html), [vCards](http://xmpp.org/extensions/xep-0054.html), [Delayed Delivery](http://xmpp.org/extensions/xep-0203.html),  [Private XML Storage](http://xmpp.org/extensions/xep-0049.html) and [Roster Item Exchange](http://xmpp.org/extensions/xep-0144.html).

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

FUTURE
------

We have some ideas on making the library more extensible, since this version is quite rigid.

This includes instead of parsing out values into JSON, returning objects that include the DOM node of the XMPP stanza and a list of XPaths for known elements that can be parsed out, this will allow the client library to lazily retrieve.

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

Combining this with a delivery system that emphasizes pattern matching / condition mapping instead of brittle pre-baked event listeners, we can design a lighter and more extensible library.
