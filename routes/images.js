const path = require('path');
const process = require('process');

const express = require('express');

const router = express.Router();

router.get('/:imageHash', (req, res, next) => {
  const imageHash = req.params.imageHash;
  const currentPath = path.resolve(`../uploads/images/${imageHash}`);
  const directoryPath = process.cwd();
  const absolutePath = path.join(directoryPath, currentPath);
  res.sendFile(absolutePath);
});

module.exports = router;
