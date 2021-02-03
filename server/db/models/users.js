'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Orders, {
        foreignKey: 'id',
        onDelete: "cascade",
        onUpdate: "cascade",
      });
    }
  };
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    restaurant: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};

// module.exports = (sequelize, DataTypes) => {
//   const Users = sequelize.define('users', {
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     admin: DataTypes.BOOLEAN,
//     role: DataTypes.ENUM('hall', 'cook'),
//   }, {})
//   Users.associate = function (models) {
//   };
//   return Users
// }
