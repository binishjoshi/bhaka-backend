const createError = require('http-errors');
const validationCheck = require('../hooks/validationCheck');
const jwt = require('jsonwebtoken');

const { sequelize } = require('../initDb');

const Album = require('../models/album');
const Song = require('../models/song');

const authorizeArtistAccount = require('../hooks/authorizeArtistAccount');

const create = async (req, res, next) => {
  validationCheck(req, next);

  const { title, songs, type, artist } = req.body;

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
      },
      { transaction: transac }
    );

    // create entry for all songs in the album
    for (let i = 0; i < songs.length; i++) {
      const newSong = await Song.create(
        {
          title: songs[i].title,
          artist: artist,
          featuredArtist: songs[i].featuredArtist,
          genre: songs[i].genre,
          album: newAlbum.id,
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
  }
};

exports.create = create;
