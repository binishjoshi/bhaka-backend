const { DataTypes } = require('sequelize');
const { sequelize } = require('../initDb');

const Genre = sequelize.define('Genre', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Genre;
