const models = require('../db/models')
const error = require('../../utils.js')

const deleteProduct = async (req, res) => {
  const { productId } = req.params
  try {
    const product = await models.Products.findOne({ where: { id: productId } })
    if (product) {
      const deleteProduct = await models.Products.destroy({ where: { id: productId } })
      res.status(200).json(product)
    } else {
      res.json(error(400, "Produto não existe"))
    }
  } catch (error) {
    console.log(error)
  }
}

const getAllProducts = async (req, res) => {
  try {
    const products = await models.Products.findAll({
      order: [
        ['id', 'ASC']
      ]
    })
    res.json(products)
  } catch (error) {
    console.log(error)
  }
}

const getProduct = async (req, res) => {
  const { productId } = req.params
  try {
    const product = await models.Products.findOne({ where: { id: productId } })
    if (!product) {
      res.json(error(404, `não existe produto com id ${productId}`))
    } else {
      res.json(product)
    }
  } catch (error) {
    console.log(error)
  }
}

const postProduct = async (req, res) => {
  const { name, price, image, type, subitem } = req.body

  if (!name || !price) {
    res.json(error(400, 'não foi indicado name ou price'))
  } else {
    const newProduct = {
      name,
      price,
      image: image || null,
      type: type || null,
      subitem: subitem || null,
    }
    try {
      const product = await models.Products.create(newProduct)
      res.json(product)
    } catch (error) {
      console.log("error", error)
    }
  }
}

const updateProduct = (req, res) => {
  const { name, price } = req.body
  const { productId } = req.params
  res.json({ op: "update", name, price })
}

module.exports = {
  deleteProduct,
  getAllProducts,
  getProduct,
  postProduct,
  updateProduct
}