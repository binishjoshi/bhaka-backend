const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const albumsControllers = require('../controllers/albums');

router.post(
  '/create',
  [
    check('title').not().isEmpty(),
    check('songs').not().isEmpty(),
    check('type').not().isEmpty(),
    check('artist').not().isEmpty(),
  ],
  albumsControllers.create
);

module.exports = router;
