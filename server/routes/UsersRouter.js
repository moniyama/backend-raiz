const { Router } = require('express')
const usersController = require('../controller/UsersController.js')

const router = Router()

router.delete('/:uid', usersController.deleteUser)
router.get('/', usersController.getAllUsers)
router.get('/:uid', usersController.getUser)
router.post('/', usersController.postUser)
router.put('/:uid', usersController.updateUser)

module.exports = router