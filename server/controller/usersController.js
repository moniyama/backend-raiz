const models = require('../db/models')

const deleteUser = (req, res) => {
  // requer auth
  const { uid } = req.params
  res.json(`delete User ${uid}`)
}

const getAllUsers = async (req, res) => {
  // requer auth
  // headers  
  try {
    const users = await models.Users.findAll({ raw: true })
    return res.json(users)
  } catch (error) {
    console.log(error)
    res.json("caiu no catch")
  }
}

const getUser = (req, res) => {
  // requer auth
  const { uid } = req.params
  res.json(`get User by ${uid}`)
}

const postUser = (req, res) => {
  const { email, password } = req.body
  res.json({ email, password })
}

const updateUser = (req, res) => {
  const { email, password } = req.body
  const { uid } = req.params
  res.json({ op: `update user: ${uid}`, email, password })
}

module.exports = {
  deleteUser,
  getAllUsers,
  getUser,
  postUser,
  updateUser
}