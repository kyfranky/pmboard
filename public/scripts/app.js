
// A placeholder image if the user does not have one
const PLACEHOLDER = 'https://placeimg.com/60/60/people';

// An anonymous user if the message does not have that information
const dummyRoom = {
  avatar: PLACEHOLDER,
  room_name: 'Anonymous'
};

// Establish a Socket.io connection
const socket = io();// Initialize our Feathers client application through Socket.io

// with hooks and authentication.
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  // Use localStorage to store our login token
  .configure(feathers.authentication({
    storage: window.localStorage
  }));

// Get the Feathers services we want to use

// const userService = app.service('users');
const roomsService = app.service('rooms');


const vm = new Vue({
  el: '#app',
  data: {
    user: {
      authenticated: false
    }
  },
  created () {
    app.authenticate().then(() => {
      this.user.authenticated = true;
      console.log(app.get('user'))
    })
    // On errors we just redirect back to the login page
      .catch(error => {
        if (error.code === 401) window.location.href = '/login.html'
      })
  }
});

// Components:
// ChatApp

Vue.component('chat-app', {
  template: '#chat-app-template'
});

Vue.component('user-list', {
  template: '#user-list-template',

  data () {
    return {
      dummyRoom: dummyRoom,
      isHover : false,
      rooms: []
    }
  },

  mounted () {
    // Find all users
    roomsService.find().then(page => {

      for (let i in page.data) {

        page.data[i] = Object.assign({}, page.data[i], {
          url: ("kamar.html?id="+page.data[i].id)
        });

        console.log(page.data[i].url);
      }

      this.rooms = page.data;

    });

    // We will also see when new users get created in real-time
    roomsService.on('created', rooms => {

      rooms = Object.assign({}, rooms, {
        url: ("kamar.html?id="+rooms.id)
      });

      console.log(rooms.url);

      this.rooms.push(rooms)
    })
  },



  methods: {

    mover: function(){

      this.isHover  = !this.isHover ;

      console.log("a");
    },

    logout () {
      app.logout().then(() => {
        vm.user.authenticated = false;
        window.location.href = '/index.html'
      })
    }
  }
});

Vue.component('center-data', {
  template: '#center-data-template',

  data () {
    return {
      fname: app.get('user').first_name
    }
  },

});
