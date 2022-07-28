const { Sequelize } = require('sequelize');

const { DATABASE, USER, PASSWORD, HOST, PORT } = require('./env');

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect: 'postgres',
  port: PORT,
});

const initializeDb = async () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Successfully connected to the database');
    })
    .catch((error) => {
      console.log('Unable to connect to the database: ', error.message);
    });

  try {
    await sequelize.sync({
      force: false,
      alter: false,
    });
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', `Error syncing: ${error.message}`);
  }
};

exports.initializeDb = initializeDb;

exports.sequelize = sequelize;
