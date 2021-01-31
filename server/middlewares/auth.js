const jwt = require('jsonwebtoken')
const models = require('../db/models')
const error = require('../../utils')

const tokenVerify = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    res.status(401).json(error(401, "token não fornecido"))
  } else {
    try {
      const decoded = jwt.verify(token, 'HMAC')
      const hasUser = await models.Users.findOne({
        where: {
          id: decoded.id,
          email: decoded.email
        }
      })
      if (hasUser) {
        next()
      } else {
        res.status(401).json(error(401, "token de usuário inexistente"))
      }
    } catch (err) {
      res.status(401).json(error(401, "token inválido"))
      console.log(err)
    }
  }
}

module.exports = tokenVerify