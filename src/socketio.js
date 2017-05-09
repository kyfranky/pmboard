/**
 * Created by franky on 4/10/2017.
 */
'use strict';

const socketio = require('feathers-socketio');

module.exports = function () {
  const app = this;

  // Set up socketio
  app.configure(socketio(function (io) {

    io.on('connection', function (socket) {

      socket.on('joinRoom', function (datas) {

        var room = "Room " + (datas.roomId).toString();

        socket.join(room);

        console.log(socket.id + " join room : " + room);


        socket.emit('hello', socket.rooms);

      });

      socket.on('sendMessages', function (data) {

        socket.to(getRoom()).emit("getMessages", data, socket.feathers.payload.userId);

      });

      socket.on('checkroom', function () {

        console.log(socket.rooms);

        socket.to(getRoom()).emit("salam", "halo");

      });

      socket.on('halos', function (data) {


        console.log(data);

      });

      socket.emit(`${socket.id} "is connected"`);

      console.log(`${socket.id} "connect"`);

      socket.on('disconnect', () => {
        console.log(`${socket.id} "disconnect"`);
      });

      socket.on('sendMove', function (data) {

        console.log("Move");
        socket.to(getRoom()).emit("getMove", data);

      });

      socket.on('sendAdd', function (data) {

        console.log("Add");
        socket.to(getRoom()).emit("getAdd", data);

      });

      socket.on('sendDelete', function (data) {

        console.log("Delete");
        socket.to(getRoom()).emit("getDelete", data);

      });

      socket.on('sendChgTxt', function (data) {

        console.log("Change Text");
        socket.to(getRoom()).emit("getChgTxt", data);

      });

      socket.on('sendConnectorUpdate', function (data) {
        console.log("Change Connector");
        socket.to(getRoom()).emit("setConnector", data);
      });

      socket.on('sendDataUpdate', function (data) {
        console.log("Change Data");
        socket.to(getRoom()).emit("setData", data);
      });

      socket.on('sendCreatedGantt', function (data) {
        console.log("Create Gant");
        socket.to(getRoom()).emit("getCreatedGantt", data);
      });

      socket.on('sendDeletedGantt', function (data) {
        console.log("Delete Gantt");
        socket.to(getRoom()).emit("getDeletedGantt", data);
      });



      function getRoom() {

        var data = Object.values(socket.rooms)

        for (let i = 0; i < data.length; i++) {
          if (data[i].includes("Room ") == true) {
            return data[i];
            break;
          }
        }

      }

    });

  }));

  console.log("socket ready !");

};
