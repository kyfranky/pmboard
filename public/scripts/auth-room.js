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
      roomId: getQueryVariable('id')
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

      $('.username').append(user.firstName);

      app.service('projects').find({

        query: {
          id: getQueryVariable('id'),
          include: 1
        }

      })
        .then(respone => {

          const team = respone.data[0].users;

          team.forEach(function (data) {

            $('#team-result').append(
              `<div class="pop-client-bar">
              <div class="bar-image">
                <img src="images/ui-sherman.jpg">
              </div>
              <div class="bar-data">
                <ul>
                  <li>${data.firstName} ${data.lastName} </li>
                  <li style="font-size: 9pt">
                  <p><span class="fa fa-briefcase" aria-hidden="true"></span>programer asdasd asd as da</p>
                  <p><span class="fa fa-building" aria-hidden="true"></span>tokopediaasdasdasdasdasdasd</p>
                </li>
                </ul>
              </div>
            </div>`)

          })

          const respones = respone.data[0];

          $(".projectname").append(respones.ProjectTitle);
          $(".projectroom").append(respones.id);

          $("#pname").append(respones.ProjectTitle);
          $("#pmname").append(respones.PmName);
          $("#strtdate").append(moment(respones.StartDate).format('DD-MM-YYYY'));
          $("#enddate").append(moment(respones.EndDate).format('DD-MM-YYYY'));

          $('#chlink').attr('href', '/projectcharter.html?id=' + getQueryVariable('id'));
          $('#mmlink').attr('href', '/mindmaps.html?id=' + getQueryVariable('id'));
          $('#gclink').attr('href', '/ganttchart.html?id=' + getQueryVariable('id'));

          $('#teamlink').attr('href', '/team.html?id=' + getQueryVariable('id'));

        });

      app.service('messages').find({
        query: {
          roomID: getQueryVariable('id'),
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

        })
        .catch(function (error) {
          console.log(error);
        });

    })
    .then(() => {
      findInvitation();
      findFriends(getQueryVariable('id'));
    })
    .then(() => {
      stopIntro();
    })
    .catch(function (error) {
      //window.location.href = '/login.html';

      console.log(error)

    });

  function rightMessages(data, name) {

    $('.messages').append(
      `<li class="i">
     <div class="head">
     <span class="time">${moment(data.createdAt).format('h:mm a')}, Today</span>
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

        $('.messages').append(
          `<li class="friend-with-a-SVAGina">
      <div class="head">
      <span class="name">${respone.firstName}</span>
      <span class="time">${moment(data.createdAt).format('h:mm a')}, Today</span>
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

        $('.messages').append(
          `<li class="friend-with-a-SVAGina">
      <div class="head">
      <span class="name">${respone.firstName}</span>
      <span class="time">${moment().format('h:mm a')}, Today</span>
      </div>
      <div class="message">${data}</div>
      </li>`
        );

      });

    toBottom();

  }

});

function toBottom() {

  $('.messages').scrollTop(100000);

};

function getQueryVariable(variable) {

  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  console.log('Query Variable ' + variable + ' not found');

};

function send(data) {
  socket.emit('sendMessages', data);
};

function stopIntro() {


  $(".se-pre-con").fadeOut("slow");


}
