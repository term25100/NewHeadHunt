const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Vacation = sequelize.define('Vacation', {
  vacation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vacation_name: {
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
  work_type: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  about_work_type: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  work_region: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  work_city: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  work_adress: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  zip_code: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  company_email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  company_phone: {
    type: DataTypes.STRING(18),
    allowNull: false
  },
  company_site: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  work_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  required_skills: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  work_advantages: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  additionally: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  company_image: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  advantages_describe: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  posted: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'vacations', // Название таблицы, если отличается
  timestamps: false
});

module.exports = Vacation;
