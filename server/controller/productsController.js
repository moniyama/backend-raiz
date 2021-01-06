
const deleteProduct = (req, res) => {
  // requer auth
  const { ProductId } = req.params
  res.json(`delete Product ${ProductId}`)
}

const getAllProducts = (req, res) => {
  // requer auth
  // headers
  res.json("get Products")
}

const getProduct = (req, res) => {
  // requer auth
  const { ProductId } = req.params
  res.json(`get Product by ${ProductId}`)
}

const postProduct = (req, res) => {
  const { name, price } = req.body
  res.json({ name, price })
}

const updateProduct = (req, res) => {
  const { name, price } = req.body
  res.json({ op: "update", name, price })
}

module.exports = {
  deleteProduct,
  getAllProducts,
  getProduct,
  postProduct,
  updateProduct
}