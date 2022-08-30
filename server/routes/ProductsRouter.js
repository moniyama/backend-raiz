const { Router } = require("express")
const tokenVerify = require('../middlewares/auth')
const limiter = require('../middlewares/rate-limiter')
const productsController = require('../controller/ProductsController')

const router = Router()
router.use(tokenVerify)
router.delete('/:productId', productsController.deleteProduct)
router.get('/', productsController.getAllProducts)
router.get('/:productId', productsController.getProduct)
router.post('/', limiter, productsController.postProduct)
router.put('/:productId', productsController.updateProduct)

module.exports = router