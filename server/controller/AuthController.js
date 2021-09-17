const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const models = require('../db/models')
const error = require('../../utils')

const createToken = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new Error(400, 'email/senha não fornecido')
  } else {
    try {
      const user = await models.Users.findOne({ where: { email } })
      if (user) {
        const userData = user.dataValues
        const passwordIsRight = await bcrypt.compare(password, userData.password)
        if (passwordIsRight) {
          const token = jwt.sign({ email, id: userData.id }, 'HMAC', { expiresIn: "1y" })
          userData.token = token
          delete userData.password
          return res.status(200).json(userData)
        } else {
          throw new Error("email/senha inválido")
        }
      } else {
        throw new Error("email/senha inválido")
      }
    } catch (err) {
      return res.status(400).json(error(400, err.message));
    }
  }
}

module.exports = { createToken }