const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const models = require('../db/models')
const error = require('../../utils')

const createToken = async (req, res) => {
  const { email, password } = req.body
  const errors = {
    missingData: { code: 400, message: "email/senha não fornecido" },
    invalidCredentials: { code: 400, message: "email ou senha inválido" }
  }
  try {
    if (!email || !password) {
      throw (errors.missingData)
    }
    const user = await models.Users.findOne({ where: { email } })
    if (!user) {
      throw (errors.invalidCredentials)
    }
    const userData = user.dataValues
    const { password: userPassword, id } = user.dataValues
    const passwordIsRight = await bcrypt.compare(password, userPassword)
    if (!passwordIsRight) {
      throw (errors.invalidCredentials)
    }
    const token = jwt.sign({ email, id }, 'HMAC', { expiresIn: "1y" })
    userData.token = token
    delete userData.password
    return res.status(200).json(userData)
  } catch (err) {
    return res.status(err.code).json(err);
  }
}

module.exports = { createToken }