const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const songsControllers = require('../controllers/songs');

router.get('/:songId', songsControllers.getSongMetadata);

router.post(
  '/search/',
  [check('searchQuery').not().isEmpty()],
  songsControllers.search
);

router.get('/stream/:songId/:userId', songsControllers.stream);

router.get('/stream/android/:songId/:userId', songsControllers.streamAndroid);

module.exports = router;
