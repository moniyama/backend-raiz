const jwt = require('jsonwebtoken')
const models = require('../db/models')
const error = require('../../utils.js')

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
      if (!hasUser) {
        res.json(error(401, "Usuário inexistente"))
      } else {
        next()
      }
    } catch (err) {
      res.json(error(401, "token inválido")) // seilá que code usar
      console.log(err)
    }
  }
}

module.exports = tokenVerify