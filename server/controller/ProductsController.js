const models = require('../db/models')
const error = require('../../utils')

const deleteProduct = async (req, res) => {
  const { productId } = req.params
  const errors = {
    notFound: { code: 404, message: 'Produto não encontrado' },
  }
  try {
    const product = await models.Products.findByPk(productId)
    if (!product) {
      throw (errors.notFound)
    }

    await models.Products.destroy({ where: { id: productId } })
    return res.status(200).json(product)
  } catch (err) {
    return res.status(err.code).json(err)
  }
}

const getAllProducts = async (req, res) => {
  const errors = {
    notFound: { code: 404, message: 'Produtos não encontrados' },
  }
  try {
    const products = await models.Products.findAll({
      order: [
        ['id', 'ASC']
      ]
    })
    if (!products) {
      throw (errors.notFound)
    }
    return res.status(200).json(products)
  } catch (err) {
    return res.status(err.code).json(err)
  }
}

const getProduct = async (req, res) => {
  const { productId } = req.params
  const errors = {
    notFound: { code: 404, message: 'Produto não encontrado' },
  }
  try {
    const product = await models.Products.findByPk(productId)
    if (!product) {
      throw (errors.notFound)
    }
    return res.status(200).json(product)
  } catch (err) {
    return res.status(err.code).json(err)
  }
}

const postProduct = async (req, res) => {
  const { name, price, image, type, subType, flavor, complement } = req.body
  const errors = {
    missingData: { code: 400, message: 'não foi indicado name ou price' },
  }

  try {
    if (!name || !price) {
      throw (errors.missingData)
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
    return res.status(err.code).json(err)
  }
}

const updateProduct = (req, res) => {
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