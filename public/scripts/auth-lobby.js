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

  });

  app.authenticate()
    .then(response => {
      console.log('Authenticated!', response);
      return app.passport.verifyJWT(response.accessToken);
    })
    .then(payload => {
      console.log('JWT Payload', payload);
      return app.service('users').get(payload.userId);
    })
    .then(user => {
      app.set('user', user);

      console.log(user)

      $('.username').append(user.firstName);

      app.service('projects').find({
        query:{
          include:2
        }
      })
        .then(page => {
          const datas = page.data;
          // Add every user to the list
          datas.forEach(addRoom);
          console.log(datas);

          stopIntro();
          findInvitation();
          findFriends();

        })
        .catch(function (error) {
          console.log(error)
        });

      app.service('users').find({
        query:{
          include:1
        }
      })
        .then(page => {
          const data = page.data;
          console.log(data);
        })
        .catch(function (error) {
          console.log(error)
        });

    })
    .catch(function (error) {
      console.log(error)
    });

});

function addRoom(room) {
  app.service('users').get(room.CreatedID)
    .then(respone => {
      $('.container').append(`
        <div class="box project">
        <a href="room.html?id=${room.id}">
        <span class="icon-cont">
        <i class="fa fa-briefcase"></i>
        </span>
        <h3>${room.ProjectTitle}</h3>
        <ul class="slip">
        <li>Creator &ensp;:&ensp;<span>${respone.firstName}</span></li>
        <li>Start :&ensp;${moment(room.StartDate).format('YYYY-MM-DD')}</li>
        <li>End   :&ensp;${moment(room.EndDate).format('YYYY-MM-DD')}</li>
        </ul>
        </a>
        </div>`
      );

    });
};

function stopIntro() {


  $(".se-pre-con").fadeOut("slow");


}
