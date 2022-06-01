const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const artistAccountsController = require('../controllers/artistAccounts');

router.post(
  '/signup',
  [
    check('username').isLength({ min: 6, max: 20 }),
    check('email').not().isEmpty().normalizeEmail().isEmail(),
    check('password').not().isEmpty(),
  ],
  artistAccountsController.signup
);

router.post(
  '/signin',
  [check('username').not().isEmail(), check('password').not().isEmpty()],
  artistAccountsController.signin
);

module.exports = router;
