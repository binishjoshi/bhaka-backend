const createError = require('http-errors');
const fs = require('fs');
const process = require('node:process');
const path = require('node:path');

const Song = require('../models/song');

const getSongMetadata = async (req, res, next) => {
  const songId = req.params.songId;

  let song;

  try {
    song = await Song.findOne({ where: { id: songId } });
  } catch (error) {
    return next(createError(500, 'Error getting songs metadata'));
  }

  const findFileSize = (filePath) => {
    if (!filePath) return 'NA';
    let fullPath = path.join(process.cwd(), filePath);
    fullPath = fullPath.replace(/ /g, '');
    return fs.statSync(fullPath).size;
  };

  res.json({
    title: song.title,
    duration: song.duration,
    artist: song.artist,
    featuredArtist: song.featuredArtist,
    genre: song.genre,
    album: song.album,
    release: song.release,
    playCount: song.playCount,
    likes: !!song.likedBy ? song.likedBy.length : 0,
    coverArt: song.coverArt,
    songSize: findFileSize(song.filePath),
    songSizeLossy: findFileSize(song.filePathLossy),
  });
};

const stream = async (req, res, next) => {
  console.log(
    '\x1b[33m%s\x1b[0m',
    `Gotta optimize so that there aren't multiple request to the database`
  );
  const range = req.headers.range;
  if (!range) {
    return next(createError(416, 'Requires range header'));
  }
  const songId = req.params.songId;

  let song;

  try {
    song = await Song.findOne({
      attributes: ['filePath'],
      where: { id: songId },
    });
  } catch (error) {
    return next(createError(404, 'Requested song not found'));
  }

  let songPath = path.join(process.cwd(), song.filePath);
  songPath = songPath.replace(/ /g, '');
  const songSize = fs.statSync(songPath).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB;
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, songSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${songSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'audio/flac',
  };

  res.writeHead(206, headers);

  const audioStream = fs.createReadStream(songPath, { start, end });
  audioStream.pipe(res);
};

exports.getSongMetadata = getSongMetadata;
exports.stream = stream;
