const { DataTypes } = require('sequelize');
const { sequelize } = require('../initDb');

const ArtistAccount = sequelize.define('ArtistAccount', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  email: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  password: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  artists: {
    type: DataTypes.ARRAY(DataTypes.UUID),
  },
});

module.exports = ArtistAccount;
