const { Router } = require('express')
const tokenVerify = require('../middlewares/auth')
const usersController = require('../controller/UsersController')

const router = Router()

router.delete('/:uid', tokenVerify, usersController.deleteUser)
router.get('/', tokenVerify, usersController.getAllUsers)
router.get('/:uid', tokenVerify, usersController.getUser)
router.post('/', usersController.postUser)
router.put('/:uid', tokenVerify, usersController.updateUser)

module.exports = router