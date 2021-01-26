const { Router } = require("express")
const ordersController = require('../controller/OrdersController')

const router = Router()

router.delete('/:orderId', ordersController.deleteOrder)
router.get('/', ordersController.getAllOrders)
router.get('/:orderId', ordersController.getOrder)
router.post('/', ordersController.postOrder)
router.put('/', ordersController.updateOrder)

module.exports = router