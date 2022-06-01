const { DataTypes } = require('sequelize');
const { sequelize } = require('../initDb');

const Artist = sequelize.define('Artist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  picture: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  followers: {
    type: DataTypes.ARRAY(DataTypes.UUID),
  },
  verified: {
    type: DataTypes.CHAR,
    allowNull: false,
    defaultValue: false, // |true|false|pending
  },
});

module.exports = Artist;
