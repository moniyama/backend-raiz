const jwt = require('jsonwebtoken')
const models = require('../db/models')
const { errorHandler } = require('../middlewares/error')

const tokenVerify = async (req, res, next) => {
  const token = req.headers.authorization
  const errors = {
    invalidToken: { code: 401, message: "token inválido" },
    missingToken: { code: 401, message: "token não fornecido" }
  }

  try {
    if (!token) {
      return errorHandler(errors.missingToken, req, res)
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
      return errorHandler(errors.invalidToken, req, res)
    }
    next()
  } catch (err) {
    return errorHandler(errors.invalidToken, req, res)
  }
}

module.exports = tokenVerify