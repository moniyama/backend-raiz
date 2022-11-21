const models = require('../db/models')
const { error } = require('../../utils')

const deleteProduct = async (req, res) => {
  const { productId } = req.params
  try {
    const product = await models.Products.findByPk(productId)
    if (product) {
      const deleteProduct = await models.Products.destroy({ where: { id: productId } })
      res.status(200).json(product)
    } else {
      res.status(404).json(error(404, "Produto não existe"))
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
    res.status(200).json(products)
  } catch (error) {
    console.log(error)
  }
}

const getProduct = async (req, res) => {
  const { productId } = req.params
  try {
    const product = await models.Products.findByPk(productId)
    if (!product) {
      res.status(404).json(error(404, `não existe produto com id ${productId}`))
    } else {
      res.status(200).json(product)
    }
  } catch (error) {
    console.log(error)
  }
}

const postProduct = async (req, res) => {
  const { name, price, image, type, subType, flavor, complement } = req.body

  if (!name || !price) {
    res.status(400).json(error(400, 'não foi indicado name ou price'))
  } else {
    const newProduct = {
      name,
      price: parseFloat(price),
      image: image || null,
      type: type || null,
      sub_type: subType || null,
      flavor: flavor || null,
      complement: complement || null,
    }
    try {
      const product = await models.Products.create(newProduct)
      res.status(200).json(product)
    } catch (error) {
      console.log("error", error)
    }
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