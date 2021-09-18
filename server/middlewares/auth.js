const jwt = require('jsonwebtoken')
const models = require('../db/models')

const tokenVerify = async (req, res, next) => {
  const token = req.headers.authorization
  const errors = {
    invalidToken: { code: 401, message: "token inválido" },
    missingToken: { code: 401, message: "token não fornecido" }
  }
  try {
    if (!token) {
      throw (errors.missingToken)
    }
    const decoded = jwt.verify(token, 'HMAC')
    const { id, email } = decoded
    const hasUser = await models.Users.findOne({
      where: {
        id,
        email
      }
    })
    res.locals.user = hasUser;
    if (!hasUser) {
      throw (errors.invalidToken)
    }
    next()
  } catch (err) {
    return res.status(err.code).json(err)
  }
}

module.exports = tokenVerify