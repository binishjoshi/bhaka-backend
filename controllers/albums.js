const fs = require('fs');
const md5 = require('md5');

const validationCheck = require('../hooks/validationCheck');

const { sequelize } = require('../initDb');

const Album = require('../models/album');
const Song = require('../models/song');

const authorizeArtistAccount = require('../hooks/authorizeArtistAccount');
const createError = require('http-errors');

const create = async (req, res, next) => {
  validationCheck(req, next);

  const { title, songs, type, artist, year } = req.body;

  let songArray = JSON.parse(songs);

  authorizeArtistAccount(req, next);

  const transac = await sequelize.transaction();

  try {
    let albumSongs = [];

    // create entry for new album
    const newAlbum = await Album.create(
      {
        title,
        type,
        songs: [],
        artist,
        coverArt: req.files.coverImage[0].path,
        year,
      },
      { transaction: transac }
    );

    // create entry for all songs in the album
    for (let i = 0; i < songArray.length; i++) {
      let songMd5;
      const buf = fs.readFileSync(req.files.songFiles[i].path);
      songMd5 = md5(buf);

      const newSong = await Song.create(
        {
          title: songArray[i].title,
          artist: artist,
          featuredArtist: songArray[i].featuredArtist,
          genre: songArray[i].genre,
          album: newAlbum.id,
          hash: songMd5,
          filePath: req.files.songFiles[i].path,
        },
        { transaction: transac }
      );
      albumSongs.push(newSong.id);
    }

    // update new album with newly entered songs
    await Album.update(
      {
        songs: albumSongs,
      },
      {
        where: {
          id: newAlbum.id,
        },
        transaction: transac,
      }
    );

    await transac.commit();
    res.json({ albumId: newAlbum.id });
  } catch (error) {
    console.log(error);
    await transac.rollback();
    return next(createError(500, 'Album creation failed'));
  }
};

const getAlbumById = async (req, res, next) => {
  const albumId = req.params.albumId;

  let album;

  try {
    album = await Album.findOne({ where: { id: albumId } });
  } catch (error) {
    return next(createError(500, `Album fetch failed: ${error.message}`));
  }

  if (album === null) {
    return next(createError(404, 'No album found for given album ID'));
  }

  for (let key in album.dataValues) {
    if (typeof album.dataValues[key] === 'string') {
      album.dataValues[key] = album.dataValues[key].trimEnd();
    }
  }

  res.json(album.dataValues);
};

const getAlbumsByArtistId = async (req, res, next) => {
  const artistId = req.params.artistId;

  let albums;
  try {
    albums = await Album.findAll({ where: { artist: artistId } });
  } catch (error) {
    return next(createError(500, error.message));
  }

  if (albums.length === 0) {
    return next(createError(404, 'No albums found for given artist ID'));
  }

  albums.forEach((album) => {
    for (let key in album.dataValues) {
      if (typeof album.dataValues[key] === 'string') {
        album.dataValues[key] = album.dataValues[key].trimEnd();
      }
    }
  });

  res.json(albums);
};

exports.create = create;
exports.getAlbumById = getAlbumById;
exports.getAlbumsByArtistId = getAlbumsByArtistId;
