const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const artistsControllers = require('../controllers/artists');

router.post(
  '/create',
  [
    check('name').not().isEmpty(),
    check('picture').not().isEmpty(),
    check('description').not().isEmpty(),
  ],
  artistsControllers.create
);

router.get('/:artistId', artistsControllers.get);

module.exports = router;
