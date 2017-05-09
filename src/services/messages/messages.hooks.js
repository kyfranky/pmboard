const {authenticate} = require('feathers-authentication').hooks;

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [addSender],
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

function addSender(hook) {

  const userid = hook.params.user.id;

  hook.data = Object.assign({}, hook.data, {
    senderID: userid
  });

  return Promise.resolve(hook);

}
