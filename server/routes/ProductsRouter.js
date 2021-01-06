const express = require('express')
const productsController = require('../controller/productsController.js')
const router = express.Router()

router.delete('/:productId', productsController.deleteProduct)
router.get('/', productsController.getAllProducts)
router.get('/:productId', productsController.getProduct)
router.post('/', productsController.postProduct)
router.put('/', productsController.updateProduct)

module.exports = router