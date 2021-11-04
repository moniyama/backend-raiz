const models = require('../db/models')
const { ordersErrors } = require('../middlewares/error')
const { rearrangeOrdersObject } = require('../../utils')

const deleteOrder = async (req, res, next) => {
  const restaurant = res.locals.user.dataValues.restaurant
  const { orderId } = req.params
  try {
    const order = await models.Orders.findByPk(orderId,
      { include: [{ model: models.Products }, { model: models.Users }] }
    )
    if (!order) {
      return next (ordersErrors.notFound)
    }
    if (restaurant !== order.dataValues.User.dataValues.restaurant) {
      return next (ordersErrors.denyAccess)
    }
    await models.Orders.destroy({
      where: { id: orderId },
      cascade: true,
    })
    return res.status(200).json(rearrangeOrdersObject([order])[0])
  } catch (err) {
    return next(err);
  }
}

const getAllOrders = async (req, res, next) => {
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
    if (!orders) {
      return next(ordersErrors.notFound)
    }
    return res.status(200).json(rearrangeOrdersObject(orders))
  } catch (err) {
    return next(err);
  }
}

const getOrder = async (req, res, next) => {
  const { orderId } = req.params
  const restaurant = res.locals.user.dataValues.restaurant
  try {
    const order = await models.Orders.findByPk(orderId, {
      include: [{ model: models.Products }, { model: models.Users, }]
    })
    if (!order) {
      return next(ordersErrors.notFound)
    }
    if (restaurant !== order.dataValues.User.dataValues.restaurant) {
      return next(ordersErrors.denyAccess)
    }
    return res.status(200).json(rearrangeOrdersObject([order])[0])
  } catch (err) {
    return next(err);
  }
}

const postOrder = async (req, res, next) => {
  const { client, table, products } = req.body
  const userId = res.locals.user.dataValues.id

  try {
    if (!table || !client || products.length === 0) {
      return next(ordersErrors.missingData)
    } else {    // verificar produtos, antes de criar uma order
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
          return next(ordersErrors.missingProductData)
        } else {
          return true
        }
      })
      if (checkProducts) {
        await models.ProductsOrders.bulkCreate(productsToCreate)
        const orderCreated = await models.Orders.findByPk((order.id), { include: [{ model: models.Products }] })
        return res.status(200).json(rearrangeOrdersObject([orderCreated])[0])
      }
    }
  } catch (err) {
    return next(err);
  }
}

const updateOrder = async (req, res, next) => {
  const restaurant = res.locals.user.dataValues.restaurant
  const { status } = req.body
  const { orderId } = req.params
  try {
    if (!status || !orderId) {
      return next(ordersErrors.missingData)
    }
    const order = await models.Orders.findByPk(orderId, { include: [{ model: models.Products }, { model: models.Users }] })
    if (!order) {
      return next(ordersErrors.notFound)
    }
    if (restaurant !== order.dataValues.User.dataValues.restaurant) {
      return next(ordersErrors.denyAccess)
    }

    const orderData = order.dataValues
    const { status: orderStatus, processedAt: orderProcessDate } = order.dataValues
    if (orderStatus === status) {
      return next(ordersErrors.noDataChange)
    }
    if (!orderProcessDate) {
      orderData.processedAt = new Date()
    }
    orderData.status = status
    await models.Orders.update(orderData, { where: { id: order.id } })
    const updatedOrder = await models.Orders.findByPk(orderId, { include: [{ model: models.Products }] })
    return res.status(200).json(rearrangeOrdersObject([updatedOrder])[0])
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  deleteOrder,
  getAllOrders,
  getOrder,
  postOrder,
  updateOrder
}