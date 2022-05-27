const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.json({ message: 'Could not find route' });
  return next(createError(404, 'Could not find route'));
});

app.listen(5000, () => {
  console.log('App listening on 5000');
});
