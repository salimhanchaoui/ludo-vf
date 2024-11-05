// models/Fournisseurs.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const Fournisseurs = sequelize.define('Fournisseurs', {
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
  phoneNumber: DataTypes.TEXT,
}, {
  tableName: 'fournisseurs',
  timestamps: false,
});

module.exports = Fournisseurs;
