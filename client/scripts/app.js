var app = {
  rooms: {'Show all': true},
  friends: {},

  init: function() {
    $(document).ready(function () {
      $('h1').click(function() {
        console.log('h1 clicked');
      });
      $('#send .submit').on('click', function(event) {
        event.preventDefault();
        app.handleSubmit();
        $('#send').find('input')[1].value = '';
      });
      $('.refresh').on('click', function() {
        app.fetch();
        app.updateRooms();
      });
      $('#addRoom .addRoom').on('click', function (event) {
        event.preventDefault();
        var room = $('#addRoom').serializeArray()[0].value;
        app.addRoom(room);
        $('#addRoom').find('input')[0].value = '';
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
    var currentRoom = $('#selectRoom').find(':selected').text();
    var query = currentRoom === 'Show all' ? {} : {'where': {'roomname':currentRoom}};
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      data: query,
      success: function (data) {
        var messages = data.results;
        
        _.each(messages, function(message) {
          if(!(message.roomname in app.rooms)) {
            app.rooms[message.roomname] = true;
          }
          app.addMessage(message);
        });
      $('.username').click(function() {
          var user = $(this).text();
          app.addFriend(user);
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
    var user = message.username;
    var room = message.roomname;
    if (user in app.friends) {
      var message = `<p class='chat' room='${room}'><span class='username'></span><span>: </span><span class='message friend'></span></p>`;
      var $starter = $(message);
      $starter.find('.username').text(user);
      $starter.find('.message').text(text);
    }
    else {
      var message = `<p class='chat' room='${room}'><span class='username'></span><span>: </span><span class='message'></span></p>`;
      var $starter = $(message);
      $starter.find('.username').text(user);
      $starter.find('.message').text(text);
    }
    $('#chats').append($starter);
  },

  addRoom: function(room) {
    app.rooms[room] = true;
    room = `<option value='${room}'>${room}</option>`;
    $('#selectRoom').append(room);
  },

  updateRooms: function() {
    $('#selectRoom').children().remove();
    for (var key in app.rooms) {
      app.addRoom(key);
    }
  },

  addFriend: function(user) {
    app.friends[user] = true;
    console.log(user + ' added as a friend');
  },

  handleSubmit: function() {
    var formdata = $('#send').serializeArray();
    var currentRoom = $('#selectRoom').find(':selected').text();
    var message = {
      username: formdata[0].value,
      text: formdata[1].value,
      roomname: currentRoom
    };
    app.send(message);
  }
};

app.init();

setInterval(app.fetch, 50000);




