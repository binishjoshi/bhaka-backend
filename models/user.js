const { DataTypes } = require('sequelize');
const { sequelize } = require('../initDb');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.CHAR,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.CHAR,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.CHAR,
    allowNull: true,
  },
  liked: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: true,
  },
  createdPlaylists: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: true,
  },
  followedPlaylists: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: true,
  },
  preference: {
    type: DataTypes.CHAR(4),
    defaultValue: 'opus',
  }
});

module.exports = User;
