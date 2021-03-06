const users = require('./users/users.service.js');
const projects = require('./projects/projects.service.js');
const teams = require('./teams/teams.service.js');
const messages = require('./messages/messages.service.js');
const friends = require('./friends/friends.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(projects);
  app.configure(teams);
  app.configure(messages);
  app.configure(friends);
};
