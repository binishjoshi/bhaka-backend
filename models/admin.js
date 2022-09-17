const { DataTypes } = require('sequelize');
const { sequelize } = require('../initDb');

const Admin = sequelize.define('Admin', {
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
});

module.exports = Admin;
