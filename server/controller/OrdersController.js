const deleteOrder = (req, res) => {
  // requer auth
  const { orderId } = req.params
  res.json(`delete order ${orderId}`)
}

const getAllOrders = (req, res) => {
  // requer auth
  res.json("get orders")
}

const getOrder = (req, res) => {
  // requer auth
  const { orderId } = req.params
  res.json(`get order by ${orderId}`)
}

const postOrder = (req, res) => {
  // como vai ser o input de array de products?
  const { userId, client, products } = req.body
  res.json({ userId, client, products })
}

const updateOrder = (req, res) => {
  const { userId, client, products } = req.body
  res.json({ op: "update", userId, client, products })
}

module.exports = {
  deleteOrder,
  getAllOrders,
  getOrder,
  postOrder,
  updateOrder
}