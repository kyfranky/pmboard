var roomnumber = getQueryVariable("id");

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  console.log('Query Variable ' + variable + ' not found');
}

console.log(roomnumber);



// A placeholder image if the user does not have one
const PLACEHOLDER = 'https://placeimg.com/60/60/people';

// An anonymous user if the message does not have that information
const dummyUser = {
  avatar: PLACEHOLDER,
  email: 'Anonymous'
};

// Establish a Socket.io connection
const socket = io();

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  // Use localStorage to store our login token
  .configure(feathers.authentication({
    storage: window.localStorage
  }));

let username;

// Get the Feathers services we want to use
const userService = app.service('users');

var vm = new Vue({
  el: '#app',
  data: {
    user: {
      authenticated: false
    },
    fname: 'anonymous'
  },

  created(){

    app.authenticate().then(() => {
      this.user.authenticated = true;
    })
    // On errors we just redirect back to the login page

      .catch(error => {
        if (error.code === 401) window.location.href = '/login.html'
      });

  }
});

socket.on('connect', function () {

  app.authenticate().then(() => {

    username = app.get('user').first_name;
    socket.emit('adduser', username);
    socket.emit('sendchat', "i'm here");
    socket.emit('checkroom', "check 1 2 3");
    switchRoom(roomnumber)

  })
    .catch(error => {
      if (error.code === 401) window.location.href = '/login.html'
    });



});

socket.on('updatechat', function (username, data) {
  console.log(username," : ",data);
  $('#conversation').append('<b>' + username + ':</b> ' + data + '<br>');
});


socket.on('absen', function (username, data) {
  console.log(username," : ",data);
});


socket.on('updaterooms', function (rooms, current_room) {
  $('#rooms').empty();
  $.each(rooms, function (key, value) {
    if (value == current_room) {
      $('#rooms').append('<div>' + value + '</div>');
    }
    else {
      $('#rooms').append('<div><a href="#" onclick="switchRoom(\'' + value + '\')">' + value + '</a></div>');
    }
  });
});

function switchRoom(room) {
  socket.emit('switchRoom', roomnumber);
  console.log("room :", room);
}

$(function(){
  $('#datasend').click( function() {
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
  });

  $('#data').keypress(function(e) {
    if(e.which == 13) {
      $(this).blur();
      $('#datasend').focus().click();
    }
  });

  $('#roombutton').click(function(){
    var name = $('#roomname').val();
    $('#roomname').val('');
    socket.emit('create', name)
  });
});

