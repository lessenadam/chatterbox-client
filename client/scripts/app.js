// YOUR CODE HERE:

$.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/messages',
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
}