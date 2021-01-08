'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Orders.init({
    client_name: DataTypes.STRING,
    table: DataTypes.INTEGER,
    status: DataTypes.ENUM('pending', 'canceled', 'delivering', 'delivered')
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};