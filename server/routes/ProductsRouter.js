const { Router } = require("express")
const productsController = require('../controller/ProductsController.js')

const router = Router()

router.delete('/:productId', productsController.deleteProduct)
router.get('/', productsController.getAllProducts)
router.get('/:productId', productsController.getProduct)
router.post('/', productsController.postProduct)
router.put('/', productsController.updateProduct)

module.exports = router