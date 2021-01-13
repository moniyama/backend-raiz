// const bcrypt = require('bcrypt');
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

const getUser = async (req, res) => {
  // requer auth
  const { uid } = req.params
  try {
    const user = await models.Users.findAll({
      where: {
        id: uid
      }
    })
    res.json(user)
  } catch (error) {
    res.json('caiu no catch do getUser by id')
  }
}

const postUser = (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    const saltRounds = 12;
    // bcrypt.hash({ email }, saltRounds, function (err, hash) {
    // console.log(hash)
    // Store hash in your password DB.
    // });
  }
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
