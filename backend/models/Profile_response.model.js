const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Profiles_response = sequelize.define('Profiles-response', {
  response_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  profile_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title_message: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  salary_range: {
    type: DataTypes.STRING(255),
  },
  message_response: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'profiles_response',
  timestamps: false
});