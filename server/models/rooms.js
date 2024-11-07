// models/Rooms.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const Rooms = sequelize.define('Rooms', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roomName: DataTypes.TEXT,
  entryfees: DataTypes.FLOAT,
  burningRate: DataTypes.FLOAT,
  price: DataTypes.FLOAT,
  botDifficulty: DataTypes.FLOAT,
}, {
  tableName: 'rooms',
  timestamps: false,
});

module.exports = Rooms;
