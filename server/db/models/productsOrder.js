'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductsOrders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Orders.belongsToMany(models.Products, {
        through: "ProductsOrders", foreignKey: 'order_id', onDelete: "cascade",
        onUpdate: "cascade",
      });
      models.Products.belongsToMany(models.Orders, {
        through: "ProductsOrders", foreignKey: 'product_id', onDelete: "cascade",
        onUpdate: "cascade",
      });
    }
  };
  ProductsOrders.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    qtd: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductsOrders',
  });
  return ProductsOrders;
};