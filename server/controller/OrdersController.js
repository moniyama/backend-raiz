const models = require('../db/models')
const { error } = require('../../utils')
const sequelize = require('sequelize')

const rearrangeOrdersObject = (array) => {
  return array.map(obj => {
    delete obj.dataValues.User
    obj.dataValues.Products.forEach(product => {
      product.dataValues.qtd = product.dataValues.ProductsOrders.dataValues.qtd
      delete product.dataValues.ProductsOrders
      delete product.dataValues.image
      delete product.dataValues.type
      delete product.dataValues.sub_type
      delete product.dataValues.createdAt
      delete product.dataValues.updatedAt
      delete product.dataValues.price
    })
    return obj
  })
}

const deleteOrder = async (req, res) => {
  const restaurant = res.locals.user.dataValues.restaurant
  const { orderId } = req.params
  try {
    const order = await models.Orders.findByPk(orderId,
      { include: [{ model: models.Products }, { model: models.Users }] }
    )
    if (order) {
      if (restaurant !== order.dataValues.User.dataValues.restaurant) {
        res.status(403).json(error(403, "Acesso negado. Ordem não pertence ao restaurante"))
      }
      await models.Orders.destroy({
        where: { id: orderId },
        cascade: true,
      })
      res.status(200).json(rearrangeOrdersObject([order])[0])
    } else {
      res.status(404).json(error(404, "Ordem não existe"))
    }
  } catch (error) {
    console.log(error)
  }
}

const getAllOrders = async (req, res) => {
  const restaurant = res.locals.user.dataValues.restaurant
  try {
    const orders = await models.Orders.findAll({
      include: [{
        model: models.Users,
        required: true,
        where: {
          restaurant: restaurant
        }
      },
      {
        model: models.Products,
      }]
    })
    res.status(200).json(rearrangeOrdersObject(orders))
  } catch (error) {
    console.log(error);
  }
}

const getOrder = async (req, res) => {
  const { orderId } = req.params
  const restaurant = res.locals.user.dataValues.restaurant
  try {
    const order = await models.Orders.findByPk(orderId, {
      include: [{ model: models.Products }, { model: models.Users, }]
    })
    if (!order) {
      res.status(404).json(error(404, "Ordem não existe"))
    }
    if (restaurant !== order.dataValues.User.dataValues.restaurant) {
      res.status(403).json(error(403, "Acesso negado. Ordem não pertence ao restaurante"))
    }
    res.status(200).json(rearrangeOrdersObject([order])[0])
  } catch (error) {
    console.log(error)
  }
}

const postOrder = async (req, res) => {
  const { client, table, products } = req.body

  const userId = res.locals.user.dataValues.id
  try {
    if (!table || !client || products.length === 0) {
      res.status(400).json(error(400, "Dados insuficientes"))
    } else {
      const order = await models.Orders.create({
        client_name: client,
        user_id: parseInt(userId),
        table: parseInt(table),
        status: "pending",
        processedAt: null,
      })
      const productsToCreate = products.map(product => ({
        product_id: parseInt(product.id),
        qtd: product.qtd,
        order_id: order.id
      }))
      const checkProducts = productsToCreate.map(product => {
        if (!product.product_id || !product.qtd) {
          res.status(400).json(error(400, "Dados insuficientes de produtos"))
        } else {
          return true
        }
      })
      if (checkProducts) {
        const teste = await models.ProductsOrders.bulkCreate(productsToCreate)
        const orderCreated = await models.Orders.findByPk((order.id), { include: [{ model: models.Products }] })
        res.status(200).json(rearrangeOrdersObject([orderCreated])[0])
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const updateOrder = async (req, res) => {
  const restaurant = res.locals.user.dataValues.restaurant
  const { status } = req.body
  const { orderId } = req.params
  try {
    const order = await models.Orders.findByPk(orderId, { include: [{ model: models.Products }, { model: models.Users }] })
    if (order) {
      const orderData = order.dataValues
      if (restaurant !== order.dataValues.User.dataValues.restaurant) {
        res.status(403).json(error(403, "Acesso negado. Ordem não pertence ao restaurante"))
      } else if (orderData.status !== status) {
        if (!orderData.processedAt) {
          orderData.processedAt = new Date()
        }
        orderData.status = status
        await models.Orders.update(orderData, { where: { id: order.id } })
        const updatedOrder = await models.Orders.findByPk(orderId, { include: [{ model: models.Products }] })
        res.status(200).json(rearrangeOrdersObject([updatedOrder])[0])
      } else {
        res.status(400).json(error(400, "Sem alterações de status para realizar"))
      }
    } else {
      res.status(404).json(error(404, "Ordem não existe"))
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  deleteOrder,
  getAllOrders,
  getOrder,
  postOrder,
  updateOrder
}