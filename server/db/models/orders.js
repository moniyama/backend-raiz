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
      Orders.belongsTo(models.Users, {
        foreignKey: 'user_id',
        onDelete: "cascade",
        onUpdate: "cascade",
      });
      Orders.belongsToMany(models.Products, {
        through: "ProductsOrders",
        foreignKey: 'order_id',
        onDelete: "cascade",
        onUpdate: "cascade",
      })
    }
  };
  Orders.init({
    client_name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    table: DataTypes.INTEGER,
    status: DataTypes.STRING,
    processedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};