const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../middleware/fileUpload');

const router = express.Router();

const albumsControllers = require('../controllers/albums');

router.post(
  '/create',
  fileUpload.fields([{ name: 'songFiles' }, { name: 'coverImage' }]),
  [
    check('title').not().isEmpty(),
    check('songs').not().isEmpty(),
    check('type').not().isEmpty(),
    check('artist').not().isEmpty(),
  ],
  albumsControllers.create
);

router.get('/:albumId', albumsControllers.getAlbumById);

router.get('/artist/:artistId', albumsControllers.getAlbumsByArtistId);

module.exports = router;
