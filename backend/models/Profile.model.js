const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Profile = sequelize.define('Profile', {
  profile_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  profile_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  salary_from: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  salary_to: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  work_time: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  work_place: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  work_city: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  career: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  work_experience: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  activity_fields: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  qualities: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  educations: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  languages_knowledge: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  additionally:{
    type: DataTypes.TEXT,
    allowNull: false
  },
  posted: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: 'profiles', 
  timestamps: false
});

module.exports = Profile;