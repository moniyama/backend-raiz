const jwt = require('jsonwebtoken')
const models = require('../db/models')
const error = require('../../utils')

const createToken = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json(error(400, 'email/senha não fornecido'))
  } else {
    const user = await models.Users.findOne({ where: { email } })
    
    if(user) {
      const userData = user.dataValues
      const token = jwt.sign({ email, id:userData.id }, 'HMAC', { expiresIn: "1y" }) // vai gerar um codigo => jwt.io para decode
      userData.token = token
      delete userData.password
      res.status(200).json(userData)
    } else {
      res.status(400).json(error(400, "usuario não cadastrado"))
    }
  }
}

module.exports = { createToken }