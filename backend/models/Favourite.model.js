const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Favourite = sequelize.define('Favourite', {
  favourite_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vacation_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  profile_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }

}, {
  tableName: 'favourites', 
  timestamps: false
});


module.exports = Favourite;