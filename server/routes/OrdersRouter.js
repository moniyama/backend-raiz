const { Router } = require("express")
const tokenVerify = require('../middlewares/auth')
const limiter = require('../middlewares/rate-limiter')
const ordersController = require('../controller/OrdersController')

const router = Router()

router.use(tokenVerify)
router.delete('/:orderId', ordersController.deleteOrder)
router.get('/', ordersController.getAllOrders)
router.get('/:orderId', ordersController.getOrder)
router.post('/', limiter, ordersController.postOrder)
router.put('/:orderId', ordersController.updateOrder)

module.exports = router