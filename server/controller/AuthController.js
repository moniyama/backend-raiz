const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const models = require('../db/models')
const { authErrors } = require('../middlewares/error')

const createToken = async (req, res, next) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return next(authErrors.missingData)
    }
    const user = await models.Users.findOne({ where: { email } })
    if (!user) {
      return next(authErrors.invalidCredentials)
    }
    const userData = user.dataValues
    const { password: userPassword, id } = user.dataValues
    const passwordIsRight = await bcrypt.compare(password, userPassword)
    if (!passwordIsRight) {
      return next(authErrors.invalidCredentials)
    }
    const token = jwt.sign({ email, id }, 'HMAC', { expiresIn: "1y" })
    userData.token = token
    delete userData.password
    return res.status(200).json(userData)
  } catch (err) {
    return next(err);
  }
}

module.exports = { createToken }