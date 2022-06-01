const { validationResult } = require('express-validator');
const createError = require('http-errors');

module.exports = (req, next) => {
  const errors = validationResult(req);

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
};
