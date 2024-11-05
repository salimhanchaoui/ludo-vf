// models/Dealers.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const Dealers = sequelize.define('Dealers', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.TEXT,
  coins:DataTypes.FLOAT,
  lastName: DataTypes.TEXT,
  img: DataTypes.TEXT,
  email: DataTypes.TEXT,
  password: DataTypes.TEXT,
  phoneNumber:DataTypes.TEXT,
  fee: DataTypes.FLOAT,
}, {
  tableName: 'dealers',
  timestamps: false,
});

module.exports = Dealers;
