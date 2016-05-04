const app = {
  server: 'https://api.parse.com/1/classes/messages',
  rooms: {'Show all': true},
  friends: {},

  init: () => {
    $(document).ready(() => {
      app.addEventListeners();
      app.fetch();
    });
  },

  addEventListeners: () => {
    $('#send .submit').on('click', event => {
      event.preventDefault();
      app.handleSubmit();
      $('#send').find('input')[1].value = '';
    });
    $('.refresh').click(() => {
      app.fetch();
      app.updateRooms();
    });
    $('#addRoom .addRoom').on('click', event => {
      event.preventDefault();
      const room = $('#addRoom').serializeArray()[0].value;
      app.addRoom(room);
      $('#addRoom').find('input')[0].value = '';
    });
  },

  send: message => {
    $.ajax({
      url: app.server,
      data: JSON.stringify(message),
      type: 'POST',
      contentType: 'application/json',
      success: data => console.log('Message pushed successfully'),  
      error: data => console.error('chatterbox: Failed to get data', data)
    });
    app.fetch();
  },

  appendMessages: messages => {
    _.each(messages, message => {
      if (!(message.roomname in app.rooms)) {
        app.rooms[message.roomname] = true;
      }
      app.addMessage(message);
    });
    $('.username').click(function() {
      const user = $(this).text();
      app.addFriend(user);
    });
  },

  fetch: () => {
    app.clearMessages();
    const currentRoom = $('#selectRoom').find(':selected').text();
    const query = currentRoom === 'Show all' ? {} : {'where': {'roomname': currentRoom}};
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: query,
      success: data => app.appendMessages(data.results),
      error: data => console.error('chatterbox: Failed to get data', data)
    });
  },

  clearMessages: () => $('#chats').children().remove(),

  addMessage: message => {
    let newPost;
    if (message.username in app.friends) {
      newPost = `<p class='chat' room='${message.roomname}'><span class='username'></span><span>: </span><span class='message friend'></span></p>`;
    } else {
      newPost = `<p class='chat' room='${message.roomname}'><span class='username'></span><span>: </span><span class='message'></span></p>`;
    }
    const $starter = $(newPost);
    $starter.find('.username').text(message.username);
    $starter.find('.message').text(message.text);
    $('#chats').append($starter);
  },

  addRoom: room => {
    app.rooms[room] = true;
    room = `<option value='${room}'>${room}</option>`;
    $('#selectRoom').append(room);
  },

  updateRooms: () => {
    $('#selectRoom').children().remove();
    for (const key in app.rooms) {
      app.addRoom(key);
    }
  },

  addFriend: user => {
    app.friends[user] = true;
    console.log(`${user} added as a friend`);
  },

  handleSubmit: () => {
    const formdata = $('#send').serializeArray();
    const currentRoom = $('#selectRoom').find(':selected').text();
    const message = {
      username: formdata[0].value,
      text: formdata[1].value,
      roomname: currentRoom
    };
    app.send(message);
  }
};

app.init();

setInterval(app.fetch, 50000);




