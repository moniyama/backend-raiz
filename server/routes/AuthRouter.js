const express = require("express")
const authController = require('../controller/AuthController.js')

const router = express.Router()

router.post('/', authController.createToken)

module.exports = router