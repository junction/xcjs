/**
 * XC: XMPP Client Library.
 * @namespace
 * 
 * XMPP Client Library.
 */
var XC = {
  debug: function () {
    var message = Array.prototype.join.apply(arguments, [' ']);
    return window.console && window.console.debug && window.console.debug.apply(window.console, [message]);
  },

  log: function () {
    var message = Array.prototype.join.apply(arguments, [' ']);
    return window.console && window.console.log && window.console.log.apply(window.console, [message]);
  },

  warn: function () {
    var message = Array.prototype.join.apply(arguments, [' ']);
    return window.console && window.console.warn && window.console.warn.apply(window.console, [message]);
  },

  error: function () {
    var message = Array.prototype.join.apply(arguments, [' ']);
    return window.console && window.console.error && window.console.error.apply(window.console, [message]);
  },

  group: function () {
    if (window.console && window.console.group) {
      window.console.group.apply(window.console, arguments);
    } else {
      XC.log.apply(XC, arguments);
    }
  },

  groupEnd: function () {
    if (window.console && window.console.groupEnd) {
      window.console.groupEnd();
    }
  }
};
/**
 * Object class for XC. All objects inherit from this one.
 * @namespace
 */
XC.Object = {

  /**
   * Iterates over all arguments, adding their own
   * properties to the reciever.
   * 
   * @example
   * obj.mixin({param: value});
   * 
   * @returns {XC.Object} the reciever
   * 
   * @see XC.Object.extend
   */
  mixin: function () {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
      for (var k in arguments[i]) {
        if (arguments[i].hasOwnProperty(k)) {
          this[k] = arguments[i][k];
        }
      }
    }
    return this;
  },

  /**
   * Creates a new object which extends the current object.
   * Any arguments are mixed into the new object as if {@link XC.Object.mixin}
   * was called on the new object with remaining args.
   * 
   * @example
   * var obj = XC.Object.extend({param: value});
   * 
   * @returns {XC.Object} The new object.
   * 
   * @see XC.Object.mixin
   */
  extend: function () {
    var F = function () {},
        rc;
    F.prototype = this;
    rc = new F();
    rc.mixin.apply(rc, arguments);

    if (rc.init && rc.init.constructor === Function) {
      rc.init.call(rc);
    }

    return rc;
  }

};
/**
 * Simple error class of XC.
 * 
 * @namespace
 */
XC.Error = function () {
  this.message = Array.prototype.join.apply(arguments, [' ']);
};
XC.Error.prototype = new Error();
XC.Error.prototype.name = 'XC.Error';
/**
 * Namespace for XML elements
 * @namespace
 */
XC.XML = {};

/**
 * A simple XML element class.
 *
 * @example
 * var newElement = XC.XML.Element.extend({name: 'foo'})
 * newElement.attr('bar', 'bam');
 * newElement.addChild(XC.XML.Element.extend({name: 'child'});
 *
 * @extends XC.Object
 * @class
 */
XC.XML.Element = XC.Object.extend(/** @lends XC.XML.Element# */{
  name: null,
  attributes: null,
  xmlns: null,
  children: null,
  text: null,

  /**
   * Get or set attributes on the receiver.
   *
   * @param {String} name The attributes name.
   * @param {String} [value] If value is supplied, the attribute will be set.
   * @returns {String} the value of the attribute.
   */
  attr: function (name, value) {
    this.attributes = this.attributes || {};
    if (value) {
      this.attributes[name] = value;
    }
    return this.attributes[name];
  },

  /**
   * Add a XML child element to the receiver.
   *
   * @param {XC.XML.Element} child The XML element to add as a child.
   * @returns {XC.XML.Element} The receiver.
   */
  addChild: function (child) {
    this.children = this.children || [];
    if (child) {
      this.children.push(child);
    }
    return this;
  },

  /**
   * Return an XML string representation of this element.
   *
   * @returns {String} This XML element as XML text.
   */
  convertToString: function () {
    var ret = "";
    var attrs = [];

    if (this.xmlns) {
      this.attr('xmlns', this.xmlns);
    }

    if (this.attributes) {
      for (var name in this.attributes) {
        var val = this.attributes[name];
        if (!val) { 
          continue;
        }

        attrs.push(name + '="' + val + '"');
      }
    }

    ret += "<" + this.name;
    ret += (attrs.length > 0) ? ' ' + attrs.join(' ') : '';
    ret += ">";

    var children = this.children || [];
    for (var i = 0, len = children.length; i < len; i++) {
      ret += this.children[i].convertToString();
    }

    if (this.text) {
      ret += this.text;
    }

    ret += "</" + this.name + ">";

    return ret;
  }
}, /** @lends XC.XML.Element */ {

  /**
   * Convenience function for creating a new XC.XML.Element and
   * setting attrs and elements in a single function
   *
   * @param {Object} [attrs] A hash of attribute names to attribute values.
   * @param {XC.XML.Element[]} [elements] An array of XC.XML.Element to assign as children.
   * @returns {XC.XML.Element}
   */
  create: function (attrs, elements) {
    var ret = this.extend();

    if (attrs) {
      for (var k in attrs) {
        if (attrs.hasOwnProperty(k)) {
          var v = attrs[k];
          if (!v) {
            continue;
          }
          ret.attr(k, v);
        }
      }
    }

    elements = (elements && elements.addChild) ? [elements] : elements;
    if (elements && elements.length) {
      for (var i = 0, len = elements.length; i < len; i++) {
        ret.addChild(elements[i]);
      }
    }

    return ret;
  }
});

/**
 * Namespace for XMPP XML elements.
 * @namespace
 */
XC.XMPP = {};

/**
 * Generic XMPP stanza.
 *
 * @extends XC.XML.Element
 * @class
 */
XC.XMPP.Stanza = XC.XML.Element.extend(/** @lends XC.XMPP.Stanza# */{
  to: function (val) {
    return this.attr('to', val);
  },

  from: function (val) {
    return this.attr('from', val);
  }
});

/**
 * XMPP IQ stanza.
 *
 * @extends XC.XMPP.Stanza
 * @class
 */
XC.XMPP.IQ = XC.XMPP.Stanza.extend(/** @lends XC.XMPP.IQ# */{
  name: 'iq',

  type: function (val) {
    return this.attr('type', val);
  }
});

/**
 * XMPP PubSub Element
 *
 * @extends XC.XML.Element
 * @class
 */
XC.XMPP.PubSub = XC.XML.Element.extend(/** @lends XC.XMPP.PubSub# */{
  name: 'pubsub',
  xmlns: 'http://jabber.org/protocol/pubsub'
});

/**
 * XMPP Message stanza.
 *
 * @extends XC.XMPP.Stanza
 * @class
 */
XC.XMPP.Message = XC.XMPP.Stanza.extend(/** @lends XC.XMPP.Message# */{
  name: 'message'
});

/**
 * XMPP Presence stanza.
 * 
 * @extends XC.XMPP.Stanza
 * @class
 */
XC.XMPP.Presence = XC.XMPP.Stanza.extend(/** @lends XC.XMPP.Presence# */{
  name: 'presence'
});

/**
 * XMPP Query stanza.
 *
 * @extends XC.XMPP.Stanza
 * @class
 */
XC.XMPP.Query = XC.XML.Element.extend(/** @lends XMPP.Query# */{
  name: 'query'
});

/**
 * XMPP AdHoc Command element.
 *
 * @extends XC.XML.Element
 * @class
 */
XC.XMPP.Command = XC.XML.Element.extend(/** @lends XC.XMPP.Command# */{
  name: 'command',
  xmlns: 'http://jabber.org/protocol/commands',

  node: function (val) {
    return this.attr('node', val);
  },

  action: function (val) {
    return this.attr('action', val);
  }
});

/**
 * XMPP XDataForm element.
 *
 * @extends XC.XML.Element
 * @class
 */
XC.XMPP.XDataForm = XC.XML.Element.extend(/** @lends XC.XMPP.XDataForm# */{
  name: 'x',
  xmlns: 'jabber:x:data',

  type: function (val) {
    return this.attr('type', val);
  },

  /**
   * A convenience method for adding fields and values to the
   * XDataForm. Calling this method will add an XDataField and value to
   * this XDataForm.
   *
   * @param {String} name The name of the field, as identified in the 'var' attribute.
   * @param {String} value The text to insert into the 'value' element.
   * @param {String} type XDataField type see XEP: 0004.
   * @returns {XC.XMPP.XDataForm} The receiver.
   */
  addField: function (name, value, type) {
    var f, v;
    f = XC.XML.Element.extend({name: 'field'});
    f.attr('var', name);

    if (value) {
      v = XC.XML.Element.extend({name: 'value', text: value});
      f.addChild(v);
    }

    if (type) {
      f.attr('type', type);
    }

    return this.addChild(f);
  }
});
/**
 * XC Connection Adapter abstract object.
 *
 * An instance of this object MUST be supplied to the XC.Connection
 * instance. This object is to be defined by consumers of the API as
 * an adapter to the XMPP connection library that is being used. See
 * the example for using the XC.ConnectionAdapter with the JSJaC XMPP
 * library.
 *
 * @example
 * var conn = new JSJaCConnection();
 * var adapter = XC.ConnectionAdapter.extend({
 *   jid: conn.jid,
 *
 *   registerHandler: function (event, handler) {
 *     return conn.registerHandler(event, handler);
 *   },
 *
 *   unregisterHandler: function (event, handler) {
 *     return conn.unregisterHandler(event, handler);
 *   },
 *
 *   send: function (xml, cb, args) {
 *     return conn._sendRaw(xml, cb, args);
 *   }
 * });
 *
 * var tmp = XC.Connection.extend({connection: adapter});
 *
 * @class
 * @extends XC.Object
 */
XC.ConnectionAdapter = XC.Object.extend(/** @lends XC.ConnectionAdapter# */{
  /** The JID of this connection. */
  jid: function () {},

  /**
   * Send an XML string to the underlying connection.
   *
   * @param {String} xml The XML String to send.
   * @param {Function} callback Called when a response to this packet is received with the first argument being the received packet.
   * @param {Array} args An array of arguments to be passed to callback after the packet.
   *
   * @see XC.Connection#send
   */
  send: function (xml, callback, args) {},

  /**
   * Registers an event handler.
   *
   * @param {String} event The type of stanza for which to listen (i.e., `message', `iq', `presence.')
   * @param {Function} handler The stanza is passed to this function when it is received.
   *
   * @see XC.ConnectionAdapter#unregisterHandler
   * @see XC.Connection#registerJIDHandler
   */
  registerHandler: function (event, handler) {},

  /**
   * Unregisters an event handler.
   *
   * @param {String} event The type of stanza we were listening to (i.e., `message', `iq', `presence.')
   *
   * @see XC.ConnectionAdapter#registerHandler
   * @see XC.Connection#unregisterJIDHandler
   */
  unregisterHandler: function (event) {}
});
/**
 * Connection object to use for all XC connections. The +initConnection+
 * {@link XC.Connection#initConnection} method MUST be called after
 * extending this object.
 *
 * @class
 * @extends XC.Object
 * @property {XC.Presence} Presence#
 * @property {XC.Roster} Roster#
 * @property {XC.Chat} Chat#
 * @property {XC.Disco} Disco#
 */
XC.Connection = XC.Object.extend(/** @lends XC.Connection# */{
  /**
   * Map of instance names to instance objects. Used during
   * initConnection().
   *
   * @see XC.Connection#initConnection
   */
  services: {
    Presence:   XC.Presence,
    Roster:     XC.Roster,
    Chat:       XC.Chat,
    Disco:      XC.Disco
  },

  /**
   * Map of jids to event handler functions. Used when message events
   * are received from the connection.
   *
   * @see XC.Connection#registerJIDHandler
   * @see XC.Connection#unregisterJIDHandler
   */
  jidHandlers: {},

  /**
   * Initialize the service properties.
   *
   * @example
   * var xc = XC.Connection.extend();
   * xc.initConnection();
   *
   * @return {XC.Connection}
   */
  initConnection: function () {
    if (!this.getJID() || this.getJID() === '') {
      throw new XC.Error('Missing JID');
    }

    var serviceMap = {};

    for (var s in this.services) {
      if (this.services.hasOwnProperty(s)) {
        var service = this.services[s];

        this[s] = service.extend({connection: this});
      }
    }

    // Register for incoming messages.
    var that = this;
    this.connection.registerHandler('message', function (msg) {
      var from = msg.getFrom();
      var fn = that.jidHandlers[from];
      if (fn) {
        fn(msg);
      }
    });

    return this;
  },

  /**
   * Sends an XML string to the connection adapter.
   *
   * @param {String} xml The XML String to send.
   * @param {Function} callback Called when a response to this packet is received with the first argument being the received packet.
   * @param {Array} [args] An array of arguments to be passed to callback after the packet.
   *
   * @see XC.ConnectionAdapter#send
   */
  send: function (xml, callback, args) {
    this.connection.send(xml, callback, args || []);
  },

  /**
   * Returns the JID of this connection.
   *
   * @example
   * xc.getJID();
   *
   * @returns {String} This connection's JID.
   *
   * @see XC.ConnectionAdapter#jid
   */
  getJID: function () {
    return this.connection.jid();
  }

});
/**
 * @extends XC.Object
 * @class
 */
XC.Entity = XC.Object.extend(/** @lends XC.Entity */{
  /**
   * @type {String}
   */
  jid: null,

  /**
   * @type {String}
   */
  name: null,

  /**
   * @type {Array}
   */
  groups: null,

  /**
   * @type {XC.DiscoItem}
   */
  disco: null,

  /**
   * @type {XC.Presence.SHOW}
   */
  show: null,

  /**
   * @type {String}
   */
  status: null,

  /**
   * A number between -128 and +127
   * @type {Number}
   */
  priority: null
  
});
/**
 * @extends XC.Object
 * @class
 */
XC.Message = XC.Object.extend({
  /**
   * @type {XC.Entity}
   */
  to: null,

  /**
   * @type {XC.Entity}
   */
  from: null,  

  /**
   * @type {String}
   */
  subject: null,

  /**
   * @type {String}
   */
  body: null,

  /**
   * @type {String}
   */
  thread: null,

  /**
   * Reply to a message using this
   * message as a template:
   *   from = to,
   *   to = from,
   *   thread = thread
   * @param {String} body The message body.
   */
  reply: function (body) {
    XC.Chat.send(XC.Message.extend({
      to: this.from,
      from: this.to,
      body: body,
      thread: this.thread
    }));
  }

});
/**
 * Roster Management
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 7 & 8
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Roster = {
  XMLNS: 'jabber:iq:roster',

  /**
   * Request your roster from the server.
   * 
   * @param {Object}   [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  request: function (callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: this.XMLNS});
    iq.type('get');
    iq.addChild(q);

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        var items = packet.getElementsByTagName('item'),
            entities = [], idx = items.length,
            entity, item, groups, len;
        while (idx--) {
          item = items[idx];
          entity = XC.Entity.extend({
            jid: item.getAttribute('jid'),
            subscription: item.getAttribute('subscription'),
            name: item.getAttribute('name')
          });
          groups = item.getElemengsByTagName('group');
          len = groups ? groups.length : 0;

          if (len) {
            entity.groups = [];
          }

          while (len--) {
            entity.groups.push(groups[len].text);
          }
          entities.push(entity);
        }
        this.onSuccess(entities);
      }
    });
  },

  /**
   * Add a new entity to your roster.
   * (Same as Update + Subscribe.)
   * 
   * @param {XC.Entity} entity      The entity to add to your roster.
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  add: function (entity, callbacks) {
    this.update(entity, callbacks);
    XC.Presence.subscribe(entity, callbacks);
  },

  /**
   * Update an entity in your roster.
   * 
   * @param {XC.Entity} entity      The entity to update on your roster.
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  update: function (entity, callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: this.XMLNS}),
        item = XC.XML.Element.extend({name: 'item'}),
        Group = XC.XML.Element.extend({name: 'group'}),
        idx = !entity.groups ? 0 : entity.groups.length,
        group;
    iq.type('set');
    item.attr('jid', entity.jid);

    if (entity.name) {
      item.attr('name', entity.name);
    }

    while (idx--) {
      group = Group.extend();
      group.text = entity.groups[idx];
      item.addChild(group);
    }

    iq.addChild(item);
    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        callbacks.onSuccess();
      }
    });
  },

  /**
   * Remove an entity from your roster.
   * 
   * @param {XC.Entity} entity      The entity to remove from your roster.
   * @param {Object}    [callbacks] An Object with 'onError' and 'onSuccess'.
   */
  remove: function (entity, callbacks) {
    var iq = XC.XMPP.IQ.extend(),
        q = XC.XMPP.Query.extend({xmlns: this.XMLNS}),
        item = XC.XML.Element.extend({name: 'item'});

    item.attr('jid', entity.jid);
    item.attr('subscription', 'remove');

    this.connection.send(iq.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      } else {
        callbacks.onSuccess();
      }
    });
  },

  /**
   * Endpoint for a server-side roster push.
   *
   * @param {Array} entities An array of entities.
   */
  onRosterPush: function (entities) {},

  /**
   * Handle incoming out-of-band Roster IQs
   *
   * @param {Element} packet The incoming XML stanza.
   */
  _handleRoster: function (packet) {
    var type = packet.getAttribute('type');

    // Acknowledge a roster push.
    if (type === 'set') {
      var iq = XC.XMPP.IQ.extend();
      iq.type('result');
      iq.attr('id', packet.getAttribute('id'));
      this.connection.send(iq.convertToString());

    // Process the items passed from the roster.
    } else {
      var items = packet.getElementsByTagName('item'),
          entities = [], idx = items.length,
          entity, item, groups, len;

      while (idx--) {
        item = items[idx];
        entity = XC.Entity.extend({
          jid: item.getAttribute('jid'),
          subscription: item.getAttribute('subscription'),
          name: item.getAttribute('name')
        });
        groups = item.getElemengsByTagName('group');
        len = groups ? groups.length : 0;

        if (len) {
          entity.groups = [];
        }

        while (len--) {
          entity.groups.push(groups[len].text);
        }
        entities.push(entity);
      }
      this.onRosterPush(entities);
    }
  }

};
/**
 * Presence
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 5 & 6
 * @see http://www.ietf.org/rfc/rfc3921.txt
 */
XC.Presence = {

  SHOW: {
    AWAY: 'away',  // The entity or resource is temporarily away.
    CHAT: 'chat',  // The entity or resource is actively interested in chatting.
    DND:  'dnd',   // The entity or resource is is busy (dnd = "Do Not Disturb").
    XA:   'xa'     // The entity or resource is away for an extended period 
                   // (xa = "eXtended Away").
  },

  // In band

  /**
   * Send presence to all subscribed entities / resources
   * or send direced presence to a specific entity.
   * 
   * @param {XC.Entity} [entity]    The entity to direct presence to.
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  send: function (entity, callbacks) {
    var p = XC.XMPP.Presence.extend(),
        presence = this.presence;

    // Send directed presence.
    if (to) {
      p.to(to.jid);
    }

    if (this.status) {
      var status = XC.XML.Element.extend({
        name: 'status'
      });
      status.text = presence.status.toString();
      p.addChild(status);
    }

    if (presence.show !== XC.Presence.SHOW.AVAILABLE) {
      var show = XC.XML.Element.extend({
        name: 'show'
      });

      // Show must be one of the pre-defined constants
      if (XC.IM.Presence.SHOW[presence.show.toUpperCase()]) {
        show.text = presence.show;
        p.addChild(show);
      }
    }

    if (presence.priority) {
      var priority = XC.XML.Element.extend({
        name: 'priority'
      }), iPriority = parseInt(presence.priority, 10);

      // The priority MUST be an integer between -128 and +127
      if (iPriority > -128 && iPriority < 127) {
        priority.text = presence.priority;
        p.addChild(priority);
      }
    }

    this.connection.send(p.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      }
    });
  },

  /**
   * Send 'unavailable' presence.
   */
  unavailable: function () {
    var p = XC.XMPP.Presence.extend();
    p.type('unavailable');
    this.connection.send(p.convertToString());
  },
  
  /**
   * Request a subscription to an entity's presence.
   * 
   * @param {XC.Entity} entity      The entity to request a presence subscription from.
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  subscribe: function (entity, callbacks) {
    var p = XC.XMPP.Presence.extend();
    p.attr('type', 'subscribe');
    p.to(entity.jid);

    this.connection.send(p.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError();
      }
    });
  },

  /**
   * Unsubscribe from an entity's presence.
   * 
   * @param {XC.Entity} entity      The entity to unsubscribe from it's presence.
   * @param {Object}    [callbacks] An Object with 'onError'.
   */
  unsubscribe: function (entity, callbacks) {
    var p = XC.XMPP.Presence.extend();
    p.attr('type', 'unsubscribe');
    p.to(entity.jid);

    this.connection.send(p.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError();
      }
    });
  },

  // Out of band

  /**
   * Approve a pending subscription request from an entity.
   * 
   * @param {XC.Entity} entity      The entity requesting a presence subscription.
   */
  approveSubscription: function (entity) {
    var p = XC.XMPP.Presence.extend();
    p.attr('type', 'subscribed');
    p.to(entity.jid);

    this.connection.send(p.convertToString());
  },

  /**
   * Deny a pending subscription request from an entity.
   * 
   * @param {XC.Entity} entity      The entity requesting a presence subscription.
   */
  denySubscription: function (entity) {
    var p = XC.XMPP.Presence.extend();
    p.attr('type', 'unsubscribed');
    p.to(entity.jid);

    this.connection.send(p.convertToString());
  },

  /**
   * Endpoint for requests to subscribe to your presence.
   * 
   * @param {XC.Entity} entity      The entity requesting a presence subscription.
   */
  onSubscribe: function (entity) {},

  /**
   * Endpoint notifying that you are subscribed to the entity's presence.
   * 
   * @param {XC.Entity} entity      The entity whose presence you are subscribed to.
   */
  onSubscribed: function (entity) {},

  /**
   * Endpoint notifying that you are unsubscribed from the entity's presence.
   * 
   * @param {XC.Entity} entity      The entity whose presence you are unsubscribed from.
   */
  onUnsubscribed: function (entity) {},

  /**
   * Handle out-of-band presence stanzas
   *
   * @param {Element} packet The incoming XML stanza.
   */
  _handlePresence: function (packet) {
    var jid = packet.getAttribute('from'),
        type = packet.getAttribute('type'),
        entity = XC.Entity.extend({jid: jid});

    switch (type) {
    case 'error':
      break;
    case 'probe':
      break;
    case 'subscribe':
      this.onSubscribe(entity);
      break;
    case 'subscribed':
      this.onSubscribed(entity);
      break;
    case 'unsubscribe':
      break;
    case 'unsubscribed':
      this.onUnsubscribed(entity);
      break;
    }
  }
  
};
/**
 * One-to-one Chatting
 * @namespace
 * 
 * RFC 3921: XMPP IM; Section 4
 * @see http://ietf.org/rfc/rfc3921.txt
 */
XC.Chat = {

  TYPE: 'chat',

  /**
   * Send a message to another entity.
   * 
   * @param {XC.Message} message     The message to send to another entity.
   * @param {Object}     [callbacks] An Object that has 'onError'.
   */
  send: function (message, callbacks) {
    var msg = XC.XMPP.Message.extend(),
        body = XC.XML.Element.extend({name: 'body'}),
        subject = XC.XML.Element.extend({name: 'subject'}),
        thread = XC.XML.Element.extend({name: 'thread'}),
        active = XC.XML.Element.extend({name: 'active',
                                        xmlns: this.XMLNS});
    msg.from(message.from.jid);
    msg.to(message.to.jid);
    msg.attr('type', this.TYPE);

    if (msg.body) {
      body.text = message.body;
      msg.addChild(body);
    }

    if (message.subject) {
      subject.text = message.subject;
      msg.addChild(subject);
    }

    if (message.thread) {
      thread.text = message.thread;
      msg.addChild(thread);
    }

    this.connection.send(msg.convertToString(), function (packet) {
      if (packet.getType() === 'error') {
        callbacks.onError(packet);
      }
    });
  },

  /**
   * Endpoint to recieve out-of-band messages.
   * 
   * @param {XC.Message} message     A message from another entity.
   */
  onMessage: function (message) {},

  /**
   * Handles out-of-band messages (All incoming messages)
   * from another entity.
   * 
   * @param {Element} packet        The incoming XML stanza.
   */
  _handleMessages: function (packet) {
    var msg = XC.Message.extend({
      to: XC.Entity.extend({jid: packet.getAttribute('to')}),
      from: XC.Entity.extend({jid: packet.getAttribute('from')})
    }), subject, body, thread;

    switch (packet.getType()) {
    case 'chat':
      subject = packet.getElementsByTagName('subject');
      if (subject && subject[0]) {
        msg.subject = subject[0].text;
      }

      body = packet.getElementsByTagName('body');
      if (body && body[0]) {
        msg.body = body[0].text;
      }

      thread = packet.getElementsByTagName('thread');
      if (thread && thread[0]) {
        msg.thread = thread[0].text;
      }

      this.onMessage(msg);
    }
  }
};
/**
 * Service Discovery provides the ability to discover information about entities.
 * @namespace
 * 
 * XEP-0030: Service Discovery
 * @see http://xmpp.org/extensions/xep-0030.html
 * 
 * @requires rootItem  A list of features and items associated with your entity.
 */
XC.Disco = {

  XMLNS: 'http://jabber.org/protocol/disco',

  /**
   * @param {XC.Entity} entity
   * @param {Object}    [callbacks]
   */
  info: function (entity, callbacks) {},

  /**
   * @param {XC.Entity} entity
   * @param {Object}    [callbacks]
   */
  items: function (entity, callbacks) {},

  /**
   * The root item of the Disco Item tree.
   * @type {XC.DiscoItem}
   */
  rootItem: null
};

/**
 * Represents an item (node) in Service Discovery.
 * 
 * @extends XC.Object
 * @class
 * @see XC.Disco
 */
XC.DiscoItem = XC.Object.extend(/** @lends XC.DiscoItem */{

  /**
   * The name of the node.
   * @type {String}
   */
  name: '',

  /**
   * Namespaces of supported features.
   * @type {String}
   */
  features: [],

  /**
   * Associative array of all items in this item.
   * @type {XC.DiscoItem}
   */
  items: {},

  /**
   * Identities that this item represents.
   * @type {Object}
   */
  identities: [],

  /**
   * Add a feature to this item.
   * @param {String} xmlns The namespace of the feature to add.
   */
  addFeature: function (xmlns) {},

  /**
   * Remove a pre-existing feature from this item.
   * @param {String} xmlns The namespace of the feature to remove.
   */
  removeFeature: function (xmlns) {},

  /**
   * Add a child item to this item.
   * @param {XC.DiscoItem} discoItem The item to add.
   */
  addItem: function (discoItem) {},

  /**
   * Remove a pre-existing item from this item.
   * @param {XC.DiscoItem} discoItem The item to remove.
   */
  removeItem: function (discoItem) {},

  /**
   * Add an identity to this item.
   * {
   *   category: {String},
   *   name: {String},
   *   type: {String}
   * }
   * @param {Object} identity The identity to add.
   */
  addIdentity: function (identity) {},

  /**
   * Remove a pre-existing identity from this item.
   * @param {Object} identity The identity to remove.
   */
  removeIdentity: function (identity) {},

  /**
   * Disco items request on this item.
   * @param {XC.Entity} entity
   */
  getItems: function (entity) {},

  /**
   * Disco info request on this item.
   * @param {XC.Entity} entity
   */
  getInfo: function (entity) {}

});
