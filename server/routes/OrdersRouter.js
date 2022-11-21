const { Router } = require("express")
const tokenVerify = require('../middlewares/auth')
const ordersController = require('../controller/OrdersController')

const router = Router()

router.use(tokenVerify)
router.delete('/:orderId', ordersController.deleteOrder)
router.get('/', ordersController.getAllOrders)
router.get('/:orderId', ordersController.getOrder)
router.post('/', ordersController.postOrder)
router.put('/:orderId', ordersController.updateOrder)

module.exports = router