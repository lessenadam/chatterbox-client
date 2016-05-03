// YOUR CODE HERE:
var app = {
  init: function() {
    $(document).ready(function () {
      $('.username').unbind();
      $('.username').on('click', function() {
        console.log('click username event triggered');
        app.addFriend();
      });
      $('#send .submit').unbind();
      $('#send .submit').on('submit', function() {
        console.log('submit event triggered');
        app.handleSubmit();
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

  fetch: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      // url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        displayMessages(data);
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
    var user = message.username;
    var room = message.roomname;
    var $message = `<span>User: <span class='username'>${user}</span> <br> Text: ${text} <br> Room: ${room} <br></span>`;
    $('#chats').append($message);
  },
  addRoom: function(room) {
    $room = `<span> ${room} </span>`;
    $('#roomSelect').append($room);
  },
  addFriend: function() {
    // do soemthing\
    console.log('addFriend called');
  },

  handleSubmit: function() {
    console.log('handleSubmit called');
  }

};








var displayMessages = function(data) {
  var messages = data.results;
  _.each(messages, function(message) {
    var text = message.text;
    if(text) {
      text = text.replace(/</g, "&lt");
      text = text.replace(/>/g, "&gt");
      text = text.replace(/'/g, "&apos");
      text = text.replace(/"/g, "&quot");
    }
    var user = message.username;
    if(user) {
      user = user.replace(/</g, "&lt");
      user = user.replace(/>/g, "&gt");
      user = user.replace(/'/g, "&apos");
      user = user.replace(/"/g, "&quot");
    }
    var $message = `<span>User: ${user} <br> ${text}</span>`;
    $('#chats').append($message);
  });
};
