// models/History.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');
const Admin = require('./admin');
const Fournisseurs = require('./fournisseurs');
const Dealers = require('./dealers');
const Users = require('./users');

const History = sequelize.define('History', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  totalcoins: DataTypes.FLOAT,
  role: DataTypes.TEXT,
}, {
  tableName: 'history',
  timestamps: true,
});

module.exports = History;
