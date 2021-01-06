const jwt = require('jsonwebtoken')
const error = require('../../utils.js')

const createToken = (req, res) => {
  const { email, password } = req.body  // desestruturação de obj 
  // acessar a database   // não precisa verificar se o email/senha é valido?
  if (email && password) {
    const token = jwt.sign({ email, password }, 'HMAC') // vai gerar um codigo => jwt.io para decode
    // ele gera a estrutura do JWT: HEADER, PAYLOAD, SIGNATURE
    res.status(200).json({ token })
  } else {
    res.status(400).json(error(400, 'email/senha não fornecido'))
  }
}

module.exports = { createToken }