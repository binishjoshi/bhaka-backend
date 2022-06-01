const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const { SECRET_KEY } = require('../env');

module.exports = (req, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(createError(401, 'Unauthorized'));
    }
    const decodedToken = jwt.verify(token, SECRET_KEY);
    requestedArtistAccount = { id: decodedToken.id };
    return requestedArtistAccount;
  } catch (error) {
    console.log(error);
    return next(createError(401, 'Unauthorized'));
  }
};
