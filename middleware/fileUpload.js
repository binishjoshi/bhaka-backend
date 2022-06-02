const multer = require('multer');
const uuid = require('uuid');

const SONG_MIME_TYPE_MAP = {
  'audio/flac': 'flac',
  'audio/x-flac': 'flac',
  'audio/wave': 'wav',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/x-pn-wav': 'wav',
};

const IMAGE_MIME_TYPE_MAP = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const isSong = (mimetype) => {
  return !!SONG_MIME_TYPE_MAP[mimetype];
};

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      if (isSong(file.mimetype)) {
        callback(null, 'uploads/songs');
      } else {
        callback(null, 'uploads/images');
      }
    },
    filename: (req, file, callback) => {
      const ext = isSong(file.mimetype)
        ? SONG_MIME_TYPE_MAP[file.mimetype]
        : IMAGE_MIME_TYPE_MAP[file.mimetype];
      callback(null, uuid.v1() + '.' + ext);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid =
      !!SONG_MIME_TYPE_MAP[file.mimetype] ||
      !!IMAGE_MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type');
    callback(error, isValid);
  },
});
