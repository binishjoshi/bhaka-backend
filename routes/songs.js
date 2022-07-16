const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const songsControllers = require('../controllers/songs');

router.get('/:songId', songsControllers.getSongMetadata);

router.post('/search/', songsControllers.search);

router.get(
  '/stream/:songId',
  [check('searchQuery').not().isEmpty()],
  songsControllers.stream
);

module.exports = router;
