// Set up socket.io
let socket = io();

// Set up Feathers client side
let app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  .configure(feathers.authentication({
    storage: localStorage
  }));

$('.logout').on('click', function () {
  app.logout().then(() => window.location.href = '/login.html');
});

$(document).ready(function () {

  socket.on('connect', function () {

    app.authenticate()
      .catch(function (error) {
        window.location.href = '/login.html';
      });

    socket.emit('joinRoom', {
      text: this.id,
      roomId: getQueryVariable("id")
    });

  });

  socket.on('hello', function (data) {

    console.log(data);

  });

  socket.on('salam', function (data) {

    console.log(data);

  });

  socket.on('iniroom', function (data) {

    console.log(data);

  });

  socket.on('getMessages', function (data, id) {

    leftMessage(data, id);

  });

  app.authenticate()
    .then(response => {
      console.log('Authenticated!', response);
      // By this point your accessToken has been stored in
      // localstorage

      tokens = response.accessToken;

      return app.passport.verifyJWT(response.accessToken);
    })
    .then(payload => {
      console.log('JWT Payload', payload);
      return app.service('users').get(payload.userId);
    })
    .then(user => {
      app.set('user', user);

      app.service('projects').get(getQueryVariable("id"))
        .then(respone => {


          //$('#homelink').attr('href','/room.html?id='+getQueryVariable("id"));

        })

      app.service('messages').find({

        query: {
          roomID: getQueryVariable("id"),
          $sort: {id: 1}
        }

      })
        .then(page => {
          const messages = page.data;

          for (let i = 0; i < messages.length; i++) {

            (function (i) {

              setTimeout(function () {

                if (messages[i].senderID != user.id) {
                  leftMessages(messages[i]);
                }
                else {
                  rightMessages(messages[i], user.firstName);
                }

              }, i * 50);

            })(i);

          }
          ;

          messages.forEach(function (element) {

            console.log(element.senderID);

          });


        })
        .catch(function (error) {
          console.log(error);
        });

    })
    .catch(function (error) {
      window.location.href = '/login.html';
    });

  function rightMessages(data, name) {

    $(".messages").append(
      `<li class="i">
     <div class="head">
     <span class="time">${moment(data.createdAt).format("h:mm a")}, Today</span>
     <span class="name">${name}</span>
     </div>
     <div class="message">${data.messagesBody}</div>
     </li>`
    );

    toBottom();

  }

  function leftMessages(data) {

    app.service('users').get(data.senderID)
      .then(respone => {

        $(".messages").append(
          `<li class="friend-with-a-SVAGina">
      <div class="head">
      <span class="name">${respone.firstName}</span>
      <span class="time">${moment(data.createdAt).format("h:mm a")}, Today</span>
      </div>
      <div class="message">${data.messagesBody}</div>
      </li>`
        );

      });

    toBottom();

  }

  function leftMessage(data, id) {

    app.service('users').get(id)
      .then(respone => {

        $(".messages").append(
          `<li class="friend-with-a-SVAGina">
      <div class="head">
      <span class="name">${respone.firstName}</span>
      <span class="time">${moment().format("h:mm a")}, Today</span>
      </div>
      <div class="message">${data}</div>
      </li>`
        );

      });

    toBottom();

  }

});

function toBottom() {

  $(".messages").scrollTop(100000);

};

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  console.log('Query Variable ' + variable + ' not found');

};

function send(data) {
  socket.emit('sendMessages', data);
};
