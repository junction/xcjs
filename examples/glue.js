/*global $, Strophe, jQuery*/
var Glue = {
  con: null,
  xc: null,
  contacts: {},

  init: function () {
    var that = this;
    this.con = new Strophe.Connection('http://localhost/http-bind/');
    this.con.rawInput  = function (data) {
      that.appendXML(data, true);
    };
    this.con.rawOutput = function (data) {
      that.appendXML(data, false);
    };
    this.contacts = {};
  },

  onLoad: function () {
    $('#error').animate({top: '-' + $('#error').outerHeight() + 'px'}, 0);

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

    $('#login-form').bind('submit', function (e) {
      $('.spinner').show('slow');
      e.preventDefault();
      Glue.login(this);
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

    var contacts = this.contacts;
    // Update info in the box.
    onSelectedChanged.push(function (e) {
      var contact = contacts[$(this).attr('rel')],
          groups = contact.roster.groups || [];

      $('#info .name').html(contact.roster.name || '');
      $('#info .jid').html(contact.getBareJID());
      $('#info .groups').html(groups.join(', ').split(0, -2));
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

    $('button').live('click', function (e) {
      e.preventDefault();
    });

    $('#ack').live('click', this.hideError);
  },

  sendChat: function (body) {
    var contact = this.contacts[$('.selected').attr('rel')];
    if (contact) {
      contact.sendChat(body);
      this.appendMessage({from: {roster: {name: 'Me'}}, body: body});
    }
  },

  onConnected: function (entity) {
    this.xc.Presence.send();
    this.xc.Roster.requestItems();
  },

  onRosterItem: function (entity) {
    var name = entity.roster.name || entity.getBareJID(),
        contact;
    if (this.contacts[entity.getBareJID()]) {
      contact = this.contacts[entity.getBareJID()];
      contact.roster = entity.roster;
      $(contact._div.getElementsByClassName('name')[0]).html(name);
    } else {
      contact = entity;
      var div = $('<div class="item" rel="' + entity.getBareJID() + '">\
          <span class="name">' + name + '</span>\
          <span class="show"></span>\
          <div class="status"></div>&nbsp;\
        </div>');
      contact._div = div[0];
      $('#roster .items').append(div[0]);
      this.contacts[entity.getBareJID()] = contact;
    }
  },

  onPresence: function (entity) {
    var jid = entity.getBareJID(),
        show = entity.presence.show || '',
        status = entity.presence.status || '',
        available = entity.presence.available ? '' : ' unavailable',
        contact;
    if (this.contacts[jid]) {
      contact = this.contacts[entity.getBareJID()];
      contact.presence = entity.presence;
      $(contact._div.getElementsByClassName('show')[0]).html(show);
      $(contact._div.getElementsByClassName('status')[0]).html(status);
      if (contact.presence.available) {
        $(contact._div).removeClass('unavailable');
      } else {
        $(contact._div).addClass('unavailable');
      }
    } else {
      contact = entity;
      var div = $('<div class="item' + available + '" rel="' + entity.getBareJID() + '">\
          <span class="name">' + jid + '</span>\
          <span class="show">' + show + '</span>\
          <div class="status">' + status + '</div>&nbsp;\
        </div>');
      contact._div = div[0];
      $('#roster .items').append(div);
      this.contacts[entity.getBareJID()] = contact;
    }
  },

  appendMessage: function (message) {
    var bottom = $('#thread')[0].scrollHeight,
        maxTop = bottom - $('#thread').height(),
        top = $('#thread')[0].scrollTop;

    $('#thread').append('<div class="message">\
      <span class="from">' + (message.from.roster.name || message.from.getBareJID()) + '</span>\
      <span class="body">' + message.body + '</span></div>');

    if (top === maxTop) {
      $('#thread').animate({
        scrollTop: bottom
      }, 'fast');
    }
  },

  appendXML: function (xml, incoming) {
    var bottom = $('#console .stanzas')[0].scrollHeight,
        maxTop = bottom - $('#console .stanzas').height(),
        top = $('#console .stanzas')[0].scrollTop;

    var klass = incoming ? 'incoming' : 'outgoing';
    $('#console .stanzas').append(
      '<div class="xml ' + klass + '">' + 
        xml.replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;') + '</div>');

    if (top - maxTop < 5) {
      $('#console .stanzas').animate({
        scrollTop: bottom
      }, 0);
    }
  },

  login: function (form) {
    $('#error').hide();

    var jid = form.username.value,
        pass = form.password.value;
    this.con.connect(jid, pass, this.onStatusChanged.bind(this));
    this.xc = XC.Connection.extend({
      connectionAdapter: XC.StropheAdapter.extend({
                           connection: this.con
                         })
    });
    this.xc.Presence.registerHandler('onPresence', this.onPresence.bind(this));
    this.xc.Roster.registerHandler('onRosterItem', this.onRosterItem.bind(this));
    this.xc.Chat.registerHandler('onMessage', this.appendMessage.bind(this));
  },

  onError: function (packet) {
    $('#error').animate({top: '0px'}, 'slow');
    $('#header').animate({top: $('#error').outerHeight() + 'px'}, 'slow');
    $('#body').animate({top: ($('#error').outerHeight() + $('#header').height()) + 'px'}, 'slow');
    $('#error').html("An error occured.<a id='ack' href='javascript:;'>Ok, let me continue!</a>");
  },

  hideError: function () {
    $('#error').animate({top: '-' + $('#error').outerHeight() + 'px'}, 'slow');
    $('#header').animate({top: '0px'}, 'slow');
    $('#body').animate({top: $('#header').height() + 'px'}, 'slow');
  },

  onStatusChanged: function (status) {
    switch (status) {
    case 5:
      $('#login').animate({opacity: 0}, 'slow', null, function () {
        $('#login').css('display', 'none');
      });
      this.onConnected();
      this.hideError();
      break;
    case 6:
      $('#login').css('display', 'block');
      $('#login').animate({opacity: 1}, 'slow');
      break;
    default:
      console.log('Status changed: ' + status);
      break;
    }
  }
};

$(document).ready(function () {
  Glue.init();
  Glue.onLoad();
});
