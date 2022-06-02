const multer = require('multer');
const uuid = require('uuid');

const MIME_TYPE_MAP = {
  'audio/flac': 'flac',
  'audio/x-flac': 'flac',
  'audio/wave': 'wav',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/x-pn-wav': 'wav',
};

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/songs');
    },
    filename: (req, file, callback) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, uuid.v1() + '.' + ext);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type');
    callback(error, isValid);
  },
});
