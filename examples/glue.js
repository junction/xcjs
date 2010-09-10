var Glue = {};

Glue.XC = {

  setup: function () {
    var adapter = XC.ConnectionAdapter.extend({
      _callbacks: [],

      jid: function () { return con.jid; },

      registerHandler: function (event, handler) {
        function wrapped(stanza) {
          var packetAdapter = {
            getFrom: function () { return stanza.getAttribute('from'); },
            getType: function () { return stanza.getAttribute('type'); },
            getTo:   function () { return stanza.getAttribute('to');   },
            getNode: function () { return stanza;                      }
          };

          var newArgs = [packetAdapter];
          for (var i = 1, len = arguments.length; i < len; i++) {
            newArgs.push(arguments[i]);
          }

          handler.apply(this, newArgs);
          return true;
        }

        this.unregisterHandler(event);
        handlers[event] = con.addHandler(wrapped, null, event,
                                         null, null, null);
      },

      unregisterHandler: function (event) {
        if (handlers[event]) {
          con.deleteHandler(handlers[event]);
          delete handlers[event];
        }
      },

      send: function (xml, cb, args) {
        var node = document.createElement('wrapper');
        node.innerHTML = xml;
        node = node.firstChild;

        if (cb) {
          function wrapped(stanza) {
            var packetAdapter = {
              getFrom: function () { return stanza.getAttribute('from'); },
              getType: function () { return stanza.getAttribute('type'); },
              getTo:   function () { return stanza.getAttribute('to');   },
              getNode: function () { return stanza;                      }
            };

            var newArgs = [packetAdapter];
            for (var i = 0, len = args.length; i < len; i++) {
              newArgs.push(args[i]);
            }

            cb.apply(this, newArgs);
            return false;
          }

          var id = node.getAttribute('id');
          if (!id) {
            id = con.getUniqueId();
            node.setAttribute('id', id);
          }

          this._callbacks[id] = con.addHandler(wrapped, null, null,
                                               null, id, null);
        }

        node.setAttribute('xmlns', 'jabber:client');
        return con.send(node);
      }
    });

    this.con = XC.Connection.extend({connection: adapter});
    this.con.initConnection();
  }
};


$('#raw-xml button').click(function () {
  $('#raw-xml').hide();
});
