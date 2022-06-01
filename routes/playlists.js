const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const playlistsControllers = require('../controllers/playlists');

router.get('/:playlistId', playlistsControllers.getPlaylist);

router.post(
  '/create',
  [check('name').not().isEmpty(), check('description').not().isEmpty()],
  playlistsControllers.create
);

module.exports = router;
