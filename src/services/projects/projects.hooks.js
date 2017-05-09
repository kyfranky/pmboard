const {authenticate} = require('feathers-authentication').hooks;

const process = [
  addCreator,
  addCharter,
  addMindMap,
  addGanttChart
];

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      checkInclude,
      rawFalse
    ],
    get: [],
    create: [...process],
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

  if (!hook.params.sequelize) hook.params.sequelize = {};
  Object.assign(hook.params.sequelize, {raw: false});
  return hook;

}

function checkInclude(hook) {

  if (hook.params.query.include) {

    const switcher = hook.params.query.include;

    delete hook.params.query.include;

    const user = hook.app.services.users.Model;
    const team = hook.app.services.teams.Model;

    switch (switcher) {
      case 1 : {
        hook.params.sequelize =
          {
            attributes: ['id', 'CreatedID', 'EndDate', 'StartDate', 'PmName', 'ProjectDescription', 'ProjectTitle'],
            include: [{
              model: user,
              through: {
                where: {status: 1}
              },
              attributes: ['firstName', 'lastName'],
            }]
          };
        break;
      }
      case 2 : {
        hook.params.sequelize =
          {
            attributes: ['id', 'CreatedID', 'EndDate', 'StartDate', 'PmName', 'ProjectDescription', 'ProjectTitle'],
            include: [{
              model: user,
              through: {
                where: {status: 0}
              },
              attributes: ['firstName', 'lastName'],
            }]
          };
        break;
      }
      default : {
        break;
      }

    }

    return hook;

  }
  else {
    return hook;
  }

}

function addCreator(hook) {
  const userid = hook.params.user.id;
  const name = hook.params.user.firstName + ' ' + hook.params.user.lastName;
  if (hook.path === 'projects') {
    hook.data = Object.assign({}, hook.data, {
      CreatedID: userid,
      PmName: name
    });
  }
  else(
    hook.data = Object.assign({}, hook.data, {
      senderID: userid
    })
  );
  return Promise.resolve(hook);
};
function addCharter(hook) {

  let data = {
    'projecttitle': hook.data.ProjectTitle,
    'pmname': hook.params.user.firstName,
    'startdate': hook.data.StartDate,
    'enddate': hook.data.EndDate,
    'projectdesc': '',
    'productdesc': '',
    'showPD': false,
    'showSH': false,
    'showMBR': false,
    'showDLV': false,
    'showOBJ': false,
    'showREQ': false,
    'showRSK': false,
    'showSGN': false,
    'SH': [{'SHname': '', 'SHrole': ''}],
    'MBR': [{'MBRname': '', 'MBRrole': ''}],
    'DLV': [{'DLVname': '', 'DLVdue': '1970-01-01T00:00:00.000Z'}],
    'OBJ': [{'OBJvalue': ''}],
    'REQ': [{'REQvalue': ''}],
    'RSK': [{'RSKvalue': ''}],
    'SGN': [{'SGNname': '', 'SGNrole': ''}]
  };

  hook.data = Object.assign({}, hook.data, {
    CharterData: data
  });

  return Promise.resolve(hook);
};
function addGanttChart(hook) {

  // Hooks can either return nothing or a promise
  // that resolves with the `hook` object for asynchronous operations

  let data = [{
    'id': '0',
    'name': hook.data.ProjectTitle,
    'actualStart': hook.data.StartDate,
    'actualEnd': hook.data.EndDate,
    'connector': []
  }];

  hook.data = Object.assign({}, hook.data, {
    GanttChartData: data
  });

  return Promise.resolve(hook);

};
function addMindMap(hook) {

  let data =
    {
      'class': 'go.TreeModel',
      'nodeDataArray': [
        {
          'key': 0,
          'text': hook.data.ProjectTitle,
          'loc': '0 0',
          'movable': 'false',
          'font': 'Italic small-caps bold 48px Georgia, Serif'
        },
        {
          'key': 1,
          'parent': 0,
          'text': 'Getting more time',
          'brush': 'skyblue',
          'dir': 'right',
          'loc': '278.7833404541015 -16.01000099182128'
        },
        {
          'key': 11,
          'parent': 1,
          'text': 'Wake up early',
          'brush': 'skyblue',
          'dir': 'right',
          'loc': '412.7833404541015 -57.010000991821286'
        },
        {
          'key': 12,
          'parent': 1,
          'text': 'Delegate',
          'brush': 'skyblue',
          'dir': 'right',
          'loc': '412.7833404541015 -16.010000991821286'
        },
        {
          'key': 13,
          'parent': 1,
          'text': 'Simplify',
          'brush': 'skyblue',
          'dir': 'right',
          'loc': '412.7833404541015 24.989999008178714'
        },
        {
          'key': 2,
          'parent': 0,
          'text': 'More effective use',
          'brush': 'darkseagreen',
          'dir': 'right',
          'loc': '278.7833404541015 86.48999900817873'
        },
        {
          'key': 21,
          'parent': 2,
          'text': 'Planning',
          'brush': 'darkseagreen',
          'dir': 'right',
          'loc': '412.7833404541015 65.98999900817871'
        },
        {
          'key': 211,
          'parent': 21,
          'text': 'Priorities',
          'brush': 'darkseagreen',
          'dir': 'right',
          'loc': '492.78334045410156 45.4899990081787'
        },
        {
          'key': 212,
          'parent': 21,
          'text': 'Ways to focus',
          'brush': 'darkseagreen',
          'dir': 'right',
          'loc': '492.7833404541016 86.48999900817873'
        },
        {
          'key': 22,
          'parent': 2,
          'text': 'Goals',
          'brush': 'darkseagreen',
          'dir': 'right',
          'loc': '412.7833404541015 106.98999900817877'
        },
        {
          'key': 3,
          'parent': 0,
          'text': 'Time wasting',
          'brush': 'palevioletred',
          'dir': 'left',
          'loc': '-29.999999999999986 -31.385000991821286'
        },
        {
          'key': 31,
          'parent': 3,
          'text': 'Too many meetings',
          'brush': 'palevioletred',
          'dir': 'left',
          'loc': '-136 -82.6350009918213'
        },
        {
          'key': 32,
          'parent': 3,
          'text': 'Too much time spent on details',
          'brush': 'palevioletred',
          'dir': 'left',
          'loc': '-136.00000000000006 -21.135000991821286'
        },
        {
          'key': 33,
          'parent': 3,
          'text': 'Message fatigue',
          'brush': 'palevioletred',
          'dir': 'left',
          'loc': '-136 19.864999008178707'
        },
        {
          'key': 331,
          'parent': 31,
          'text': 'Check messages less',
          'brush': 'palevioletred',
          'dir': 'left',
          'loc': '-279 -103.13500099182129'
        },
        {
          'key': 332,
          'parent': 31,
          'text': 'Message filters',
          'brush': 'palevioletred',
          'dir': 'left',
          'loc': '-279.00000000000006 -62.1350009918213'
        },
        {
          'key': 4,
          'parent': 0,
          'text': 'Key issues',
          'brush': 'coral',
          'dir': 'left',
          'loc': '-27 241.8649990081787'
        },
        {
          'key': 41,
          'parent': 4,
          'text': 'Methods',
          'brush': 'coral',
          'dir': 'left',
          'loc': '-122 200.8649990081787'
        },
        {
          'key': 42,
          'parent': 4,
          'text': 'Deadlines',
          'brush': 'coral',
          'dir': 'left',
          'loc': '-122 241.8649990081787'
        },
        {
          'key': 43,
          'parent': 4,
          'text': 'Checkpoints',
          'brush': 'coral',
          'dir': 'left',
          'loc': '-122 282.8649990081787'
        }
      ]
    };

  hook.data = Object.assign({}, hook.data, {
    MindMapData: data
  });

  return Promise.resolve(hook);
};
