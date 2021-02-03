const models = require('../db/models')
const error = require('../../utils')

const rearrangeOrdersObject = (array) => {
  return array.map(obj => {
    delete obj.dataValues.User
    obj.dataValues.Products.forEach(product => {
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
  const { orderId } = req.params
  try {
    const order = await models.Orders.findAll({
      where: { id: orderId },
      include: [{ model: models.Products }]
    })
    if (order.length > 0) {
      await models.Orders.destroy({
        where: { id: orderId },
        cascade: true,
      })
      res.status(200).json(rearrangeOrdersObject(order)[0])
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
  // requer auth
  const { orderId } = req.params
  try {
    const order = await models.Orders.findByPk(orderId, { include: [{ model: models.Products }] })
    if (order) {
      res.status(200).json(rearrangeOrdersObject([order])[0])
    } else {
      res.status(404).json(error(404, "Ordem não existe"))
    }
  } catch (error) {
    console.log(error)
  }
}

const postOrder = async (req, res) => {
  const { client, table, productId } = req.body
  const userId = res.locals.user.dataValues.id
  try {
    if (!table || !client || !productId) {
      throw new Error()
    } else {
      const orders = await models.Orders.create({
        client_name: client,
        user_id: parseInt(userId),
        table: parseInt(table),
        status: "pending",
        processedAt: null,
      })
      const productsId = Array.from(productId).map(id => parseInt(id))
      for (const id of productsId) {
        await orders.addProducts(id)
      }
      const orderCreated = await models.Orders.findAll({
        where: {
          id: orders.id
        },
        include: models.Products
      })
      res.status(200).json(rearrangeOrdersObject(orderCreated))
    }
  } catch (err) {
    res.status(400).json(error(400, "Dados insuficientes"))
  }
}

const updateOrder = async (req, res) => {
  const { status } = req.body
  const { orderId } = req.params
  try {
    const order = await models.Orders.findByPk(orderId, { include: [{ model: models.Products }] })
    if (order) {
      const orderData = order.dataValues
      if (orderData.status !== status) {
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