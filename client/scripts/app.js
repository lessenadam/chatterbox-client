var message = {
  username: 'Alan',
  text: 'Hi Austin!',
  roomname: '4chan'
};

var app = {
  init: function() {
    $(document).ready(function () {
      $('.username').unbind();
      $('.username').on('click', function() {
        console.log('click username event triggered');
        app.addFriend();
      });
      $('#send .submit').unbind();
      $('#send .submit').on('click', function() {
        console.log('submit event triggered');
        app.handleSubmit();
      });
      $('.refresh').on('click', function() {
        app.fetch();
      });
    });
  },

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      data: JSON.stringify(message),
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        console.log("Message pushed successfully");  
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get data', data);
      }
    });
  },

  fetch: function() {
    app.clearMessages();
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
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
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get data', data);
      }
    });
  },

  clearMessages: function() {
    $('#chats').children().remove();
  },

  addMessage: function(message) {
    var text = message.text;
    if(text) {
      text = text.replace(/</g, "&lt");
      text = text.replace(/>/g, "&gt");
      text = text.replace(/'/g, "&apos");
      text = text.replace(/"/g, "&quot");
    };
    var user = message.username;
    if(user) {
      user = user.replace(/</g, "&lt");
      user = user.replace(/>/g, "&gt");
      user = user.replace(/'/g, "&apos");
      user = user.replace(/"/g, "&quot");
    }
    var room = message.roomname;
    if(room) {
      room = room.replace(/</g, "&lt");
      room = room.replace(/>/g, "&gt");
      room = room.replace(/'/g, "&apos");
      room = room.replace(/"/g, "&quot");
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
    app.fetch();
  }

};

app.init();

// app.send(message);



