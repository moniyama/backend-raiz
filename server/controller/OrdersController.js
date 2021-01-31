const deleteOrder = (req, res) => {
  // requer auth
  const { orderId } = req.params
  res.status(200).json(`delete order ${orderId}`)
}

const getAllOrders = (req, res) => {
  // requer auth
  res.status(200).json("get orders")
}

const getOrder = (req, res) => {
  // requer auth
  const { orderId } = req.params
  res.status(200).json(`get order by ${orderId}`)
}

const postOrder = (req, res) => {
  // como vai ser o input de array de products?
  const { userId, client, products } = req.body
  res.status(200).json({ userId, client, products })
}

const updateOrder = (req, res) => {
  const { userId, client, products } = req.body
  res.status(200).json({ op: "update", userId, client, products })
}

module.exports = {
  deleteOrder,
  getAllOrders,
  getOrder,
  postOrder,
  updateOrder
}