/**
 * Created by franky on 2/5/2017.
 */
'use strict';

let roomnumber = getQueryVariable("id");

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i=0;i<vars.length;i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  console.log('Query Variable ' + variable + ' not found');

}

$(document).ready(function () {



});

// A placeholder image if the room does not have one
const PLACEHOLDER = 'https://placeimg.com/60/60/people';
// An anonymous room if the message does not have that information
const dummyRoom= {
  avatar: PLACEHOLDER,
  email: 'Anonymous'
};
// The total number of rooms




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



socket.on('connect', function () {

  app.authenticate().then(() => {
    let username = app.get('user').first_name;
    let userid = app.get('user').id;

    console.log("regist to room :", roomnumber);
    socket.emit('prepareRoom',userid, username, roomnumber );
  })
    .catch(error => {
      if (error.code === 401) window.location.href = '/login.html'
    });

});

socket.on('updatechat', function (username, data) {
  console.log(username," : ",data);
});

socket.on('shoutRoom', function (username, data, room) {
  console.log(username," : ",data,room);
});

socket.on('updaterooms', function (rooms, current_room) {

});

// Get the Feathers services we want to use
const roomService = app.service('rooms');



/*
 const messageService = app.service('messages');

 $('#send-message').on('submit', function(ev) {
 // This is the message text input field
 const input = $(this).find('[name="text"]');

 // Create a new message and then clear the input field
 messageService.create({
 text: input.val()
 }).then(message => input.val(''));

 ev.preventDefault();
 });
 */

$('.logout').on('click', function() {
  app.logout().then(() => window.location.href = '/index.html');
});

app.authenticate().then(() => {

  $('.username').html(app.get('user').first_name);
  $('.projectroom').html(roomnumber);

  roomService.get(roomnumber)
    .then(
    room => $('.projectname').html(room.room_name))
  .catch(error => window.location.href = '/login.html');

  $('body').show();

})
// On errors we just redirect back to the login page
  .catch(error => window.location.href = '/login.html');



app.authenticate().then(() => {

  function joinRoom(roomId) {



    const user = app.get('user');
    return app.service('users').patch(user.id, { rooms: roomId });
  }

  let a = joinRoom("1");
  console.log(a);



})
// On errors we just redirect back to the login page
  .catch(error => console.log(error));

