// models/Users.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  victories: DataTypes.INTEGER,
  defeats: DataTypes.INTEGER,
  kills: DataTypes.INTEGER,
  level: DataTypes.INTEGER,
  coins: DataTypes.FLOAT,
  diamonds: DataTypes.FLOAT,
  gamesPlayed: DataTypes.INTEGER,
  deaths: DataTypes.INTEGER,
  name: DataTypes.TEXT,
  lastName: DataTypes.TEXT,
  email: DataTypes.TEXT,
  password: DataTypes.TEXT,
  img: DataTypes.TEXT,
  phoneNumber:DataTypes.TEXT
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = Users;
