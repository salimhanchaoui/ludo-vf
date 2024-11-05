// models/Admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.TEXT,
  lastName: DataTypes.TEXT,
  img: DataTypes.TEXT,
  email: DataTypes.TEXT,
  password: DataTypes.TEXT,
}, {
  tableName: 'admin',
  timestamps: false,
});

module.exports = Admin;
