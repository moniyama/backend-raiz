const { Router } = require("express")
const authController = require('../controller/AuthController')

const router = Router()

router.post('/', authController.createToken)

module.exports = router