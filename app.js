const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');

const { initializeDb } = require('./initDb');

const app = express();

app.use(bodyParser.json());

initializeDb();

app.listen(5000, () => {
  console.log('App listening on 5000');
});

const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);
const songsRoutes = require('./routes/songs');
app.use('/api/songs', songsRoutes);
const playlistsRoutes = require('./routes/playlists');
app.use('/api/playlists', playlistsRoutes);
const artistAccountsRoutes = require('./routes/artistAccounts');
app.use('/api/managers', artistAccountsRoutes);
const artistRoutes = require('./routes/artists');
app.use('/api/artists', artistRoutes);
const albumRoutes = require('./routes/albums');
app.use('/api/albums', albumRoutes);

app.use((req, res, next) => {
  res.json({ message: 'Could not find route' });
  return next(createError(404, 'Could not find route'));
});
