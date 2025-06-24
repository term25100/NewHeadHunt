const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(18),
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  user_image: {
    type: DataTypes.TEXT,
    allowNull:true
  }
  
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    }
  }
});
// User.associate = function(models) {
//   User.hasMany(models.Vacation, {
//     foreignKey: 'user_id',
//     as: 'vacations'
//   });
// };
module.exports = User;