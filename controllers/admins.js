const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');

const Admin = require('../models/admin');

const { SECRET_KEY } = require('../env');

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  const { username, email, password, profilePicture } = req.body;

  // check for validation error from validation check
  if (!errors.isEmpty()) {
    let errorMessage = 'Invalid input: ';
    let invalidFields = [];
    errors.errors.forEach((errObj) => {
      if (!invalidFields.includes(errObj.param)) {
        invalidFields.push(errObj.param);
      }
    });

    invalidFields.forEach((error) => {
      errorMessage += `${error} `;
    });
    return next(createError(422, errorMessage));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(createError(500, 'Could not signup'));
  }

  const createdUser = Admin.build({
    username,
    email,
    password: hashedPassword,
    profilePicture,
  });

  try {
    await createdUser.save();
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(createError(406, `${error.errors[0].path} already in use`));
    }
    return next(createError(500, 'Signing up failed'));
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
      },
      SECRET_KEY
    );
  } catch (error) {
    return next(createError(500, 'Signing up failed'));
  }

  res.status(201).json({
    token,
  });
};

const signin = async (req, res, next) => {
  const errors = validationResult(req);

  let identify;

  if (!errors.isEmpty()) {
    return next(createError(422, 'Validation error'));
  }

  const { username, password } = req.body;

  try {
    // check if the database contains a user with provided username
    identify = await User.findOne({ where: { username } });
  } catch (error) {
    // failed to query
    return next(createError(500, 'Signin failed'));
  }

  // user with provided username doesn't exists
  if (!identify) {
    return next(createError(401, `No user with username ${username}`));
  }

  // check if password is correct
  let isPasswordCorrect = false;
  try {
    let clippedPassword = identify.password.replace(/ /g, '');
    // identify has the user details of provided username
    isPasswordCorrect = await bcrypt.compare(password, clippedPassword);
  } catch (error) {
    return next(createError(500, 'Could not signin'));
  }

  // password provided is incorrect for provided username
  if (!isPasswordCorrect) {
    return next(createError(401, `Wrong password for ${username}`));
  }

  // create jwt token
  let token;
  try {
    token = jwt.sign(
      {
        id: identify.id,
        username: identify.username,
        email: identify.email,
      },
      SECRET_KEY
    );
  } catch (error) {
    return next(createError(500, 'Signin failed'));
  }

  res.status(200).json({ token });
};

exports.signup = signup;
exports.signin = signin;
