const models = require('../db/models')
const { productsErrors } = require('../middlewares/error')

const deleteProduct = async (req, res, next) => {
  const { productId } = req.params
  try {
    const product = await models.Products.findByPk(productId)
    if (!product) {
      return next(productsErrors.notFound)
    }

    await models.Products.destroy({ where: { id: productId } })
    return res.status(200).json(product)
  } catch (err) {
    return next(err)
  }
}

const getAllProducts = async (req, res, next) => {
  try {
    const products = await models.Products.findAll({
      order: [
        ['id', 'ASC']
      ]
    })
    if (!products) {
      next(productsErrors.notFound)
    }
    return res.status(200).json(products)
  } catch (err) {
    return next(err)
  }
}

const getProduct = async (req, res, next) => {
  const { productId } = req.params

  try {
    const product = await models.Products.findByPk(productId)
    if (!product) {
      next(productsErrors.notFound)
    }
    return res.status(200).json(product)
  } catch (err) {
    return next(err)
  }
}

const postProduct = async (req, res, next) => {
  const { name, price, image, type, subType, flavor, complement } = req.body

  try {
    if (!name || !price) {
      next(productsErrors.missingData)
    }
    const newProduct = {
      name,
      price: parseFloat(price),
      image: image || null,
      type: type || null,
      sub_type: subType || null,
      flavor: flavor || null,
      complement: complement || null,
    }
    const product = await models.Products.create(newProduct)
    return res.status(200).json(product)
  } catch (err) {
    return next(err)
  }
}

const updateProduct = (req, res, next) => {
  const { name, price } = req.body
  const { productId } = req.params
  res.status(200).json({ op: "update", name, price })
}

module.exports = {
  deleteProduct,
  getAllProducts,
  getProduct,
  postProduct,
  updateProduct
}