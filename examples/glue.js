/**global $, jQuery*/
var Glue = {
  start: function () {
    $('#filter-incoming').bind('click', function () {
      var display = $(this).attr('checked') ? 'block': 'none';
      $('head').append(
        '<style type="text/css">\
        .stanzas .incoming { display: ' + display + ' }\
         </style>');
    });

    $('#filter-outgoing').bind('click', function () {
      var display = $(this).attr('checked') ? 'block': 'none';
      $('head').append(
        '<style type="text/css">\
        .stanzas .outgoing { display: ' + display + ' }\
         </style>');
    });

    var consoleWidth = $('#console').width(),
        chatRight = $('#chat').css('right');
    $('#hide-console').bind('click', function () {
      if (parseInt($('#chat').css('right'), 10) === 0) {
        $('#chat').animate({right: chatRight}, 'fast');
        $('#console').animate({right: '0px'}, 'fast');
        $(this).html('Hide Console');
      } else {
        $('#chat').animate({right: '0px'}, 'fast');
        $('#console').animate({right: '-' + chatRight}, 'fast');
        $(this).html('Show Console');
      }
    });

    var newLineReplacer = new RegExp('\\n', 'g');
    $('#composer .send').bind('click', function () {
      var text = $('#composer textarea')[0].value;
      if (!text.replace(/\s/g, '')) {
        return true;
      }
      Glue.sendChat(text.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(newLineReplacer, '<br/>'));

      $('#composer textarea')[0].value = '';
      return true;
    });

    $('#composer textarea').keydown(function (e) {
      var code = e.keyCode || e.which;
      if (code === 13 && !(e.altKey || e.shiftKey)) {
        $('#composer .send').trigger('click');
        return false;
      }
      return true;
    });

    var onSelectedChanged = [];
    $('#roster .item').live('click', function (e) {
      $('#roster .selected').removeClass('selected');
      $(this).addClass('selected');

      for (var i = 0, len = onSelectedChanged.length; i < len; i++) {
        onSelectedChanged[i].apply(this, [e]);
      }
    });

    var calcPopupOffset = function (popup, sel) {
      var x = sel.offset().left + sel.width() + 25 + $('#roster .items').offset().left,
          y = sel.offset().top + sel.height() - $('#roster .items').offset().top + 10,
          height = popup.height(),
          yMin = 37,
          yMax = $(window).height() - $('header').height() - $('#roster .options').height() - height - 25;

      if ((y + height + 50) > $(window).height()) {
        y = y - height + 34;
        $('#' + popup.attr('id') + ' .arrow')
          .removeClass('top')
          .addClass('bottom');
        if (y > yMax) {
          y = yMax;
        }
      } else {
        $('#' + popup.attr('id') + ' .arrow')
          .removeClass('bottom')
          .addClass('top');
      }
      if (y < yMin) {
        y = yMin;
      }

      return { top: y, left: x };
    };

    $('#popup-info').bind('click', function (e) {
      var sel = $('#roster .selected');
      if (sel.length && parseInt($('#info').css('opacity'), 10) === 0) {
        var loc = calcPopupOffset($('#info'), sel);
        $('#info').css({top: loc.top, left: loc.left, zIndex: 10});
        $('.popup:not(#info)').animate({opacity: 0}, 'fast', null, function () {
           $(this).css('zIndex', -1);
        });
        $('#info').animate({opacity: 1}, 'fast');
      } else {
        $('#info').animate({opacity: 0}, 'fast', null, function () {
           $(this).css('zIndex', -1);
        });
      }
    });

    $('#popup-actions').bind('click', function (e) {
      var sel = $('#roster .selected');
      if (sel.length && parseInt($('#actions').css('opacity'), 10) === 0) {
        var loc = calcPopupOffset($('#actions'), sel);
        $('#actions').css({top: loc.top, left: loc.left, zIndex: 10});
        $('.popup:not(#actions)').animate({opacity: 0}, 'fast', null, function () {
           $(this).css('zIndex', -1);
        });
        $('#actions').animate({opacity: 1}, 'fast');
      } else {
        $('#actions').animate({opacity: 0}, 'fast', null, function () {
           $(this).css('zIndex', -1);
        });
      }
    });

    $('#service-actions').bind('click', function (e) {
      if (parseInt($('#actions').css('opacity'), 10) === 0) {
        var x = $(this).offset().left + $(this).width() + 25,
            y = $(this).offset().top + $(this).height();
        $('#actions').css({top: y, left: x, zIndex: 10});
        $('.popup:not(#actions)').animate({opacity: 0}, 'fast', null, function () {
           $(this).css('zIndex', -1);
        });
        $('#actions').animate({opacity: 1}, 'fast');
      } else {
        $('#actions').animate({opacity: 0}, 'fast', null, function () {
           $(this).css('zIndex', -1);
        });
      }
    });

    $('#add-contact').bind('click', function (e) {
      $('#roster .items').append('<div class="item">\
         <span clas="name">Anonymous</span>\
         <span class="show"></span>\
         <div class="status"></div>&nbsp;</div>');
    });

    // Move the popup box if it's showing
    onSelectedChanged.push(function (e) {
      var popups = $('.popup'), popup;
      for (var i = 0, len = popups.length; i < len; i++) {
        popup = $(popups[i]);
        if (parseInt(popup.css('opacity'), 10) !== 0) {
          var loc = calcPopupOffset(popup, $('#roster .selected'));
          popup.stop();
          popup.animate({top: loc.top, left: loc.left}, 'fast');
        }
      }
    });

    // Update info in the box.
    onSelectedChanged.push(function (e) {
      
    });

    $('#actions label').bind('click', function (e) {
      $('#actions .selected').removeClass('selected');
      $(this).addClass('selected');

    });

    $(document).keydown(function (e) {
      var code = e.keyCode || e.which;

      switch (code) {
      case 38:
        $('#roster .selected').prev().trigger('click');
        break;
      case 40:
        $('#roster .selected').next().trigger('click');
        break;
      case 191: // '/' as a hotkey for composing a new message
        $('#composer textarea').focus();
        return false;
      }

      if (code === 38 || code === 40) {
        var diff = $('#roster .items').offset().top,
            min = $('#roster .items')[0].scrollTop,
            height = $('#roster .items').height(),
            max = min + height,
            top = $('#roster .selected').offset().top - diff + min,
            bottom = $('#roster .selected').height() + top + 21;
        if (top <= min) {
          $('#roster .items')[0].scrollTop = top;
        } else if (bottom >= max) {
          $('#roster .items')[0].scrollTop = bottom - height;
        }
        e.stopImmediatePropagation();
        return false;
      }
      return true;
    });
  },

  sendChat: function (body) {
    this.appendMessage({name: 'Me'}, body);
  },

  appendMessage: function (from, body) {
    var bottom = $('#thread')[0].scrollHeight,
        maxTop = bottom - $('#thread').height(),
        top = $('#thread')[0].scrollTop;
    $('#thread').append('<div class="message">\
      <span class="from">' + from.name + '</span>\
      <span class="body">' + body + '</span></div>');

    if (top === maxTop) {
      $('#thread').animate({
        scrollTop: bottom
      }, 'fast');
    }
  },

  appendXML: function (xml, incoming) {
    var bottom = $('#thread')[0].scrollHeight,
        maxTop = bottom - $('#thread').height(),
        top = $('#thread')[0].scrollTop;

    var klass = incoming ? 'incoming' : 'outgoing';
    $('#console .stanzas').append(
      '<pre class="' + klass + '">' + 
        xml.replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;') + '</pre>');

    if (top === maxTop) {
      $('#console').animate({
        scrollTop: bottom
      }, 'fast');
    }
  }
};

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

$(document).ready(function () {
  Glue.start();
});
