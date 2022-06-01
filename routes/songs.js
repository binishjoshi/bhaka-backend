const express = require('express');

const router = express.Router();

const songsControllers = require('../controllers/songs');

router.get('/:songId', songsControllers.getSongMetadata);

module.exports = router;
