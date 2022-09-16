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

router.post(
  '/add',
  [check('songId').not().isEmpty(), check('playlistId').not().isEmpty()],
  playlistsControllers.add
);

module.exports = router;
