const models = require('../db/models')
const error = require('../../utils')
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
  const errors = {
    notFound: { code: 404, message: 'Ordem não encontrada' },
    denyAccess: { code: 403, message: "Acesso negado. Usuário não pertence ao restaurante" },
  }
  try {
    const order = await models.Orders.findByPk(orderId,
      { include: [{ model: models.Products }, { model: models.Users }] }
    )
    if (!order) {
      throw (errors.notFound)
    }
    if (restaurant !== order.dataValues.User.dataValues.restaurant) {
      throw (errors.denyAccess)
    }
    await models.Orders.destroy({
      where: { id: orderId },
      cascade: true,
    })
    return res.status(200).json(rearrangeOrdersObject([order])[0])
  } catch (err) {
    return res.status(err.code).json(err);
  }
}

const getAllOrders = async (req, res) => {
  const restaurant = res.locals.user.dataValues.restaurant
  const errors = {
    notFound: { code: 404, message: 'Ordem não encontrada' },
  }
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
      throw (errors.notFound)
    }
    return res.status(200).json(rearrangeOrdersObject(orders))
  } catch (err) {
    return res.status(err.code).json(err);
  }
}

const getOrder = async (req, res) => {
  const { orderId } = req.params
  const restaurant = res.locals.user.dataValues.restaurant
  const errors = {
    notFound: { code: 404, message: 'Ordem não encontrada' },
    denyAccess: { code: 403, message: "Acesso negado. Ordem não pertence ao restaurante" },
  }
  try {
    const order = await models.Orders.findByPk(orderId, {
      include: [{ model: models.Products }, { model: models.Users, }]
    })
    if (!order) {
      throw (errors.notFound)
    }
    if (restaurant !== order.dataValues.User.dataValues.restaurant) {
      throw (errors.denyAccess)
    }
    return res.status(200).json(rearrangeOrdersObject([order])[0])
  } catch (err) {
    return res.status(err.code).json(err);
  }
}

const postOrder = async (req, res) => {
  const { client, table, products } = req.body
  const userId = res.locals.user.dataValues.id
  const errors = {
    missingData: { code: 400, message: "client, table ou products não fornecido" },
    missingProductData: { code: 400, message: "id ou qtd dos produtos não fornecido" },
  }

  try {
    if (!table || !client || products.length === 0) {
      throw (errors.missingData)
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
          throw (errors.missingProductData)
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
    return res.status(err.code).json(err);
  }
}

const updateOrder = async (req, res) => {
  const restaurant = res.locals.user.dataValues.restaurant
  const { status } = req.body
  const { orderId } = req.params
  const errors = {
    notFound: { code: 404, message: 'Ordem não encontrada' },
    denyAccess: { code: 403, message: "Acesso negado. Ordem não pertence ao restaurante" },
    missingData: { code: 400, message: "status ou orderId não fornecido" },
    noDataChange: { code: 400, message: "Não há alterações para serem aplicadas" }
  }
  try {
    if (!status || !orderId) {
      throw (errors.missingData)
    }
    const order = await models.Orders.findByPk(orderId, { include: [{ model: models.Products }, { model: models.Users }] })
    if (!order) {
      throw (errors.notFound)
    }
    if (restaurant !== order.dataValues.User.dataValues.restaurant) {
      throw (errors.denyAccess)
    }
    
    const orderData = order.dataValues
    const { status: orderStatus, processedAt: orderProcessDate } = order.dataValues
    if (orderStatus === status) {
      throw (errors.noDataChange)
    }
    if (!orderProcessDate) {
      orderData.processedAt = new Date()
    }
    orderData.status = status
    await models.Orders.update(orderData, { where: { id: order.id } })
    const updatedOrder = await models.Orders.findByPk(orderId, { include: [{ model: models.Products }] })
    return res.status(200).json(rearrangeOrdersObject([updatedOrder])[0])
  } catch (err) {
    return res.status(err.code).json(err);
  }
}

module.exports = {
  deleteOrder,
  getAllOrders,
  getOrder,
  postOrder,
  updateOrder
}