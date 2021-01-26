const jwt = require('jsonwebtoken')
const models = require('../db/models')
const error = require('../../utils')

const tokenVerify = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    res.json(error(401, "token não fornecido"))
  } else {
    try {
      var decoded = jwt.verify(token, 'HMAC')
      const hasUser = await models.Users.findOne({
        where: {
          id: decoded.id,
          email: decoded.email
        }
      })
      if (hasUser) {
        next()
      } else {
        res.json(error(401, "Usuário inexistente"))
      }
    } catch (err) {
      res.json(error(401, "token inválido")) // seilá que code usar
      console.log(err)
    }
  }
}

module.exports = tokenVerify