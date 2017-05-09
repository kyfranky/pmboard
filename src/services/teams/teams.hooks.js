const {authenticate} = require('feathers-authentication').hooks;

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [

      function (hook) {

        const user = hook.app.services.users.Model;
        const project = hook.app.services.projects.Model;

        hook.params.sequelize =
          {
            include: [
              {
                model: user,
                as: 'Owners',
                attributes: ['firstName'],
                where: {id: hook.params.user.id}
              },
              {
                model: project,
                as: 'Projects'
              }
            ]
          };

        return Promise.resolve(hook);

      }


      , rawFalse],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

function rawFalse(hook) {

  console.log(hook.params.sequelize)

  if (!hook.params.sequelize) hook.params.sequelize = {};
  Object.assign(hook.params.sequelize, {raw: false});
  return hook;
}
