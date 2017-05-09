// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const projects = sequelizeClient.define('projects', {

    CreatedID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    ProjectTitle: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    },
    PmName: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    },
    StartDate: {
      type: Sequelize.DATEONLY,
      allowNull: true,
      unique: false,
    },
    EndDate: {
      type: Sequelize.DATE,
      allowNull: true,
      unique: false
    },
    ProjectDescription: {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: false
    },
    CharterData: {
      type: Sequelize.JSON,
      allowNull: true,
      unique: false
    },
    MindMapData: {
      type: Sequelize.JSON,
      allowNull: true,
      unique: false
    },
    GanttChartData: {
      type: Sequelize.JSON,
      allowNull: true,
      unique: false
    }

  }, {
    classMethods: {
      associate (models) { // eslint-disable-line no-unused-vars
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/

        projects.belongsToMany(models.users, { through: models.teams });
        projects.hasMany(models.teams);

      }
    }
  });

  return projects;
};
