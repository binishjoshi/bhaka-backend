const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const { sequelize } = require('../initDb');

const Artist = require('../models/artist');

const validationCheck = require('../hooks/validationCheck');

const { SECRET_KEY } = require('../env');
const ArtistAccount = require('../models/artistAccount');

const create = async (req, res, next) => {
  validationCheck(req, next);

  const { name, picture, description } = req.body;

  // artist account
  let requestedArtistAccount;

  // find out which artist account is trying to create artist using token from authorization header
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(createError(401, 'Unauthorized'));
    }
    const decodedToken = jwt.verify(token, SECRET_KEY);
    requestedArtistAccount = { id: decodedToken.id };
  } catch (error) {
    return next(createError(401, 'Unauthorized'));
  }

  // start a transaction
  const transac = await sequelize.transaction();

  try {
    // create a artist
    const artist = await Artist.create(
      {
        name,
        picture: req.file.path,
        description,
      },
      { transaction: transac }
    );

    // add the newly created artist to the respective artist account
    // get the artist account
    const queriedArtistAccount = await ArtistAccount.findOne({
      where: { id: requestedArtistAccount.id },
    });

    // get the artist array
    let artistArray = queriedArtistAccount.artists;

    // add the newly created artist to the array
    artistArray.push(artist.id);

    // update the array with new array containing newly created artist
    await ArtistAccount.update(
      { artists: artistArray },
      {
        where: {
          id: requestedArtistAccount.id,
        },
        transaction: transac,
      }
    );

    await transac.commit();
    res.json({ name: name, picture: req.file.path, description: description });
  } catch (error) {
    console.log(error);
    await transac.rollback();
    return next(createError(500, 'Artist creation failed'));
  }
};

const get = async (req, res, next) => {
  const artistId = req.params.artistId;

  let artist;

  try {
    artist = await Artist.findOne({ where: { id: artistId } });
  } catch (error) {
    return next(createError(500, `Aritst fetch failed: ${error.message}`));
  }

  if (artist === null) {
    return next(createError(404, `Artist not found`));
  }

  for (let key in artist.dataValues) {
    if (typeof artist.dataValues[key] === 'string') {
      artist.dataValues[key] = artist.dataValues[key].trimEnd();
    }
  }

  res.json(artist);
};

exports.create = create;
exports.get = get;
