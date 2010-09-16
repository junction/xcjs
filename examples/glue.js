/*global $, Strophe, jQuery*/
var Glue = {
  con: null,
  xc: null,
  bareJID: null,
  contacts: {},

  show: 'available',
  status: null,
  priority: 3,

  UNAVAILABLE_BUBBLE: 'bubble_gray_glass_24px.png',
  AVAILABLE_BUBBLE: 'bubble_green_glass_24px.png',
  DND_BUBBLE: 'bubble_red_glass_24px.png',

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
      if (code === 13 && !e.altKey) {
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

    $('#roster .item .show').live('click', function () {
      $('#chat').removeClass('disabled');
      $('#composer textarea').removeAttr('disabled');
      $('#composer button').removeAttr('disabled');
      $('#composer textarea').focus();
      if (this.show === 'available') {
        this.show = 'chat';
      }
    });

    $('#logged-in-as').bind('click', function () {
      if (parseInt($('#my-actions').css('opacity'), 10) !== 0) {
        $('#my-actions').animate({opacity: 0}, 'fast', null, function () {
          $('#my-actions').css('zIndex', -1);
        });
      } else {
        $('.popup:not(#my-actions)').animate({opacity: 0}, 'fast', null, function () {
          $('.popup:not(#my-actions)').css('zIndex', -1);
        });
        $('#my-actions').css('zIndex', 20);
        $('#my-actions').css({
          left: $(this).offset().left + $(this).width() + 20,
          top: 0
        });
        $('#my-actions').animate({opacity: 1}, 'fast');
      }
    });

    $('#my-show').bind('change', function () {
       that.changeShow($(this).attr('value'));
    });

    $('#my-status').bind('keydown', function (e) {
      var code = e.keyCode || e.which;
      if (code === 13) {
        $(this).blur();
        return false;
      }
    });

    $('#my-status').bind('blur', function () {
      that.changeStatus($(this).attr('value'));
    });

    var calcPopupOffset = function (popup, sel, parent) {
      parent = parent || $('#roster .items');
      var x = sel.offset().left + sel.width() + 25 + parent.offset().left,
          y = sel.offset().top + sel.height() - parent.offset().top + 10,
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
      $('#edit-dialog').css('zIndex', 5);
      $('#edit-dialog').animate({opacity: 1}, 'fast');
    });

    $('#edit-cancel').bind('click', function (e) {
      $(':input','#edit-contact-form').not(':button, :submit, :reset, :hidden')
                                      .val('')
                                      .removeAttr('checked')
                                      .removeAttr('selected');
      $('#edit-dialog').animate({opacity: 0}, 'fast', null, function () {
        $('#edit-dialog').css('zIndex', -1);
      });
      $('#edit-contact-form input[name="jid"]').removeAttr('disabled');
      e.preventDefault();
    });

    $('#edit-contact-form').bind('submit', function (e) {
      that.setRosterItem(this.jid.value, this.name.value, this.group.value);
      $(':input','#edit-contact-form').not(':button, :submit, :reset, :hidden')
                                      .val('')
                                      .removeAttr('checked')
                                      .removeAttr('selected');
      $('#edit-dialog').animate({opacity: 0}, 'fast', null, function () {
        $('#edit-dialog').css('zIndex', -1);
      });
      $('#edit-contact-form input[name="jid"]').removeAttr('disabled');
      e.preventDefault();
    });

    var that = this;
    $('#actions label').bind('click', function (e) {
      var contact = contacts[$('#roster .selected').attr('rel')];
      that[$(this).attr('rel')](contact);
    });

    $('#my-actions label').bind('click', function (e) {
      that[$(this).attr('rel')]();
    });

    // Move the popup box if it's showing
    onSelectedChanged.push(function (e) {
      var popups = $('#body .popup'), popup;
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
    $('#login').animate({opacity: 0}, 'slow', null, function () {
      $('#login').css('display', 'none');
    });

    this.xc.Presence.send();
    this.xc.Roster.requestItems();
    this.bareJID = XC.Entity.extend({jid: this.con.jid}).getBareJID();
    $('#logged-in-as').html(this.bareJID);
  },

  onRosterItem: function (entity) {
    var name = entity.roster.name || entity.getBareJID(),
        contact;
    if (entity.getBareJID() === this.bareJID) {
      return;
    }
    if (this.contacts[entity.getBareJID()]) {
      contact = this.contacts[entity.getBareJID()];
      contact.roster = entity.roster;
      $(contact._div.getElementsByClassName('name')[0]).html(name);
      if (contact.roster.subscription === 'remove') {
        $(contact._div).remove();
        delete this.contacts[entity.getBareJID()];
      }
    } else {
      contact = entity;
      var div = $('<div class="item unavailable" rel="' + entity.getBareJID() + '">\
          <span class="name">' + name + '</span>\
          <img alt="unavailable" title="unavailable" class="show"\
               src="' + this.UNAVAILABLE_BUBBLE + '"/>\
          <div class="status">&nbsp;</div>\
        </div>');
      contact._div = div[0];
      $('#roster .items').append(div[0]);
      this.contacts[entity.getBareJID()] = contact;
    }
  },

  onPresence: function (entity) {
    var jid = entity.getBareJID(),
        show = entity.presence.show || 'available',
        status = entity.presence.status || '&nbsp;',
        available = entity.presence.available ? '' : ' unavailable',
        contact;
    if (entity.getBareJID() === this.bareJID) {
      return;
    }
    var bubble = this.AVAILABLE_BUBBLE;
    if (!entity.presence.available) {
      bubble = this.UNAVAILABLE_BUBBLE;
      show = "unavailable";
    } else if (show === 'dnd' || show === 'away') {
      bubble = this.DND_BUBBLE;
    }
    if (this.contacts[jid]) {
      contact = this.contacts[entity.getBareJID()];
      contact.presence = entity.presence;
      var icon = $(contact._div.getElementsByClassName('show')[0]);
      icon.attr('alt', show);
      icon.attr('title', show);
      icon.attr('src', bubble);
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
          <img alt="' + show + '" title="' + show + '" class="show"\
               src="' + bubble + '"/>\
          <div class="status">' + status + '&nbsp;</div>\
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

    $('#chat').removeClass('disabled');
    $('#composer textarea').removeAttr('disabled');
    $('#composer button').removeAttr('disabled');

    var name = message.from.roster.name;
    if (message.from.jid) {
      name = this.contacts[message.from.getBareJID()].roster.name || message.from.getBareJID();
    }

    if (message.chatNotificationState &&
        message.chatNotificationState !== 'active') {
      var msg = name;
      switch (message.chatNotificationState) {
      case 'composing':
        msg += ' is typing...';
        break;
      case 'gone':
        msg += ' has left the chat.';
        break;
      default:
        msg = '';
        break;
      }
      $('#chat-states').html(msg);
      return;
    }

    if (!message.body) {
      return;
    }

    $('#thread').append('<div class="message">\
      <span class="from">' + name + '</span>\
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
    this.hideError();

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

    var that = this;
    this.xc.Presence.registerHandler('onSubscribed', function (request) {
      $('#actions .selected').removeClass('selected');
      $(that.contacts[request.from]._div).remove();
      delete that.contacts[request.from];
    });
    this.xc.Presence.registerHandler('onSubscribe', function (request) {
      request.accept();
    });
    this.xc.Presence.registerHandler('onUnsubscribed', function (request) {
      $('#actions .selected').removeClass('selected');
    });
  },

  onError: function (msg) {
    $('#error').animate({top: '0px'}, 'slow');
    $('#header').animate({top: $('#error').outerHeight() + 'px'}, 'slow');
    $('#body').animate({top: ($('#error').outerHeight() + $('#header').height()) + 'px'}, 'slow');
    $('#error').html("An error occured: " + msg + "<a id='ack' href='javascript:;'>x</a>");
  },

  hideError: function () {
    $('#error').animate({top: '-' + $('#error').outerHeight() + 'px'}, 'slow');
    $('#header').animate({top: '0px'}, 'slow');
    $('#body').animate({top: $('#header').height() + 'px'}, 'slow');
  },

  onStatusChanged: function (status) {
    switch (status) {
    case 5:
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
  },

  subscribe: function (entity) {
    $('#actions .selected').removeClass('selected');
    entity.sendPresenceSubscribe();
  },

  unsubscribe: function (entity) {
    $('#actions .selected').removeClass('selected');
    entity.sendPresenceUnsubscribe();
  },

  cancelSubscription: function (entity) {
    $('#actions .selected').removeClass('selected');
    entity.cancelPresenceSubscription();
  },

  removeRosterItem: function (entity) {
    var jid = entity.getBareJID(),
        that = this;
    entity.removeRosterItem({
      onSuccess: function () {
        $('#actions .selected').removeClass('selected');
        $(that.contacts[jid]._div).remove();
        delete that.contacts[jid];
      },
      onError: function () {
        $('#actions .selected').removeClass('selected');
        that.onError("Couldn't remove " + jid + " from your roster.");
      }
    });
  },

  discoItems: function (entity) {
    entity.requestDiscoItems({
      onSuccess: function () {
        $('#actions .selected').removeClass('selected');
      },
      onError: function () {
        $('#actions .selected').removeClass('selected');
        that.onError("Couldn't retrieve " + jid + "'s items.");
      }
    });
  },

  discoInfo: function (entity) {
    entity.requestDiscoInfo({
      onSuccess: function () {
        $('#actions .selected').removeClass('selected');
      },
      onError: function () {
        $('#actions .selected').removeClass('selected');
        that.onError("Couldn't retrieve " + jid + "'s info.");
      }
    });
  },

  addRosterItem: function (jid, name, groups) {
    var newItem = this.xc.Entity.extend({
      jid: jid,
      roster: {
        name: name,
        groups: groups        
      }
    });
    newItem.setRosterItem();
    newItem.sendPresenceSubscribe();
  },

  editContact: function (entity) {
    this.editDialog(entity);
  },

  logout: function () {
    this.xc.Presence.sendUnavailable();
    $('.show').attr('src', this.UNAVAILABLE_BUBBLE);
    $('.show').attr('alt', '');
    $('.show').attr('title', '');
    $('.popup').animate({opacity: 0}, 'fast', null, function () {
      $('.popup').css('zIndex', -1);
    });
    this.con.disconnect();
  },

  requestRoster: function () {
    this.xc.Roster.requestItems();
  },

  broadcastPresence: function () {
    this.xc.Presence.send(this.show, this.status, this.priority);
  },

  changeStatus: function (val) {
    this.status = val;
    this.broadcastPresence();
  },

  changeShow: function (val) {
    this.show = val;
    this.broadcastPresence();
  },

  setRosterItem: function (jid, name, group) {
    this.xc.Entity.extend({
      jid: jid,
      roster: {
        name: name,
        groups: [group]
      }
    }).setRosterItem();
  },

  editDialog: function (entity) {
    $('#edit-dialog').css('zIndex', 5);
    $('#edit-dialog').animate({opacity: 1}, 'fast');
    $('#edit-contact-form input[name="jid"]').attr('value', entity.getBareJID());
    $('#edit-contact-form input[name="jid"]').attr('disabled', 'disabled');
    $('#edit-contact-form input[name="name"]').attr('value', entity.roster.name);
    $('#edit-contact-form input[name="group"]').attr('value', entity.roster.groups.join(', '));
  },
};

$(document).ready(function () {
  Glue.init();
  Glue.onLoad();
});
