const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Vacations_response = sequelize.define('Vacations-response', {
  response_id: {
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
    allowNull: false
  },
  title_message: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message_response: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  resume_file: {
    type: DataTypes.TEXT,
    allowNull: false
  }
  
}, {
  tableName: 'vacations_response',
  timestamps: false
});

module.exports = Vacations_response;