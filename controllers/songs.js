const createError = require('http-errors');
const Song = require('../models/song');

const getSongMetadata = async (req, res, next) => {
  const songId = req.params.songId;

  let song;

  try {
    song = await Song.findOne({ where: { id: songId } });
  } catch (error) {
    return next(createError(500, 'Error getting songs metadata'));
  }

  res.json({
    title: song.title,
    duration: song.duration,
    artist: song.artist,
    featuredArtist: song.featuredArtist,
    genre: song.genre,
    album: song.album,
    release: song.release,
    playCount: song.playCount,
    likes: song.likedBy.length,
    coverArt: song.coverArt,
  });
};

exports.getSongMetadata = getSongMetadata;
