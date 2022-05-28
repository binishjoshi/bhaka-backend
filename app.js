const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const { Sequelize } = require('sequelize');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.json({ message: 'Could not find route' });
  return next(createError(404, 'Could not find route'));
});

const sequelize = new Sequelize('bhaka', 'bhaka', null, {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Successfully connected to the database');
    app.listen(5000, () => {
      console.log('App listening on 5000');
    });
  })
  .catch((error) => {
    console.log('Unable to connect to the database: ', error);
  });
