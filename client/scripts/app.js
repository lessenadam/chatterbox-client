var app = {
  init: function() {
    $(document).ready(function () {
      $('.username').on('click', function() {
        app.addFriend();
      });
      $('#send .submit').on('click', function() {
        app.handleSubmit();
      });
      $('.refresh').on('click', function() {
        app.fetch();
      });
    });
    app.fetch();
  },

  send: function(message) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      data: JSON.stringify(message),
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        console.log('Message pushed successfully');  
      },
      error: function (data) {
        console.error('chatterbox: Failed to get data', data);
      }
    });
  },

  fetch: function() {
    app.clearMessages();
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        var messages = data.results;
        _.each(messages, function(message) {
          app.addMessage(message);
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to get data', data);
      }
    });
  },

  clearMessages: function() {
    $('#chats').children().remove();
  },

  addMessage: function(message) {
    var text = message.text;
    if (text) {
      text = escapeText(text);
    }
    var user = message.username;
    if (user) {
      user = escapeText(user);
    }
    var $message = `<p class='chat'><span><span class='username'>${user}</span><br>${text}<br></span></p>`;
    $('#chats').append($message);
  },

  addRoom: function(room) {
    $room = `<span> ${room} </span>`;
    $('#roomSelect').append($room);
  },

  addFriend: function() {
    console.log('addFriend called');
  },

  handleSubmit: function() {
    console.log('handleSubmit called');
    var formdata = $('#send').serializeArray();
    var message = {
      username: formdata[0].value,
      text: formdata[1].value
    };
    app.send(message);
  }
};

var escapeText = function(str) {
  var escaped = '';
  escaped = str.replace(/</g, '&lt');
  escaped = escaped.replace(/>/g, '&gt');
  escaped = escaped.replace(/'/g, '&apos');
  escaped = escaped.replace(/"/g, '&quot');
  return escaped;
};

app.init();




