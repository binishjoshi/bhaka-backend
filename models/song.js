const { DataTypes } = require('sequelize');
const { sequelize } = require('../initDb');

const Song = sequelize.define('Song', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  duration: {
    type: DataTypes.TIME,
  },
  durationInSeconds: {
    type: DataTypes.FLOAT,
  },
  artist: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  featuredArtist: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
  },
  genre: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: false,
  },
  album: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  release: {
    type: DataTypes.DATEONLY,
  },
  playCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likedBy: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
  },
  coverArt: {
    type: DataTypes.CHAR,
  },
  filePath: {
    type: DataTypes.CHAR,
  },
  filePathLossy: {
    type: DataTypes.CHAR,
  },
  hash: {
    type: DataTypes.CHAR,
  },
  audioHash: {
    type: DataTypes.CHAR,
  },
});

module.exports = Song;
