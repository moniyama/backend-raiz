const { Router } = require("express")
const tokenVerify = require('../middlewares/auth')
const productsController = require('../controller/ProductsController')

const router = Router()
router.use(tokenVerify)
router.delete('/:productId', productsController.deleteProduct)
router.get('/', productsController.getAllProducts)
router.get('/:productId', productsController.getProduct)
router.post('/', productsController.postProduct)
router.put('/:productId', productsController.updateProduct)

module.exports = router