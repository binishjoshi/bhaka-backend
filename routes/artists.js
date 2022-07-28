const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const fileUpload = require('../middleware/fileUpload');

const artistsControllers = require('../controllers/artists');

router.post(
  '/create',
  fileUpload.single('artistImage'),
  [check('name').not().isEmpty(), check('description').not().isEmpty()],
  artistsControllers.create
);

router.get('/:artistId', artistsControllers.get);

module.exports = router;
