const bcrypt = require('bcryptjs');
const models = require('../db/models')
const jwt = require('jsonwebtoken')
const error = require('../../utils')

const rebuildObj = (arr) => {
  return arr.map(obj => {
    delete obj.dataValues.password
    return obj
  })
}

const deleteUser = async (req, res) => {
  const { uid } = req.params
  try {
    const user = await models.Users.findOne({ where: { id: uid } });
    if (!user) {
      res.status(404).json(error(404, 'usuario(a) não existe'))
    } else {
      const deleteUser = await models.Users.destroy({   // dá pra aproveitar o user??
        where: {
          id: uid
        }
      })
      if (deleteUser === 1) {
        res.status(200).json(rebuildObj([user])[0])
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const getAllUsers = async (req, res) => {
  // requer auth
  try {
    const users = await models.Users.findAll({
      order: [
        ['id', 'ASC']
      ]
    })
    res.status(200).json(rebuildObj(users))
  } catch (error) {
    console.log(error)
  }
}

const getUser = async (req, res) => {
  const { uid } = req.params
  try {
    const user = await models.Users.findOne({
      where: {
        id: uid
      }
    })
    if (user) {
      res.status(200).json(rebuildObj([user])[0])
    } else {
      res.status(404).json('usuaria solicitada no existe')
    }
  } catch (error) {
    console.log(error)
  }
}

const postUser = async (req, res) => {
  const { email, password, name, role, restaurant } = req.body

  if (!email || !password || !role || !restaurant) {
    res.status(400).json(error(400, "email, password, role ou restaurant não fornecido"))
  } else {
    try {
      const hasUser = await models.Users.findOne({ where: { email } })
      if (!hasUser) {
        const saltRounds = 12;
        const hash = await bcrypt.hash(password, saltRounds);
        const user = await models.Users.create({
          name,
          email,
          restaurant,
          password: hash,
          role: role.toLowerCase(),
        });
        const token = jwt.sign({ email, id: user.id }, 'HMAC', { expiresIn: "1y" })
        user.dataValues.token = token
        res.status(200).json(rebuildObj([user])[0])
      } else {
        res.status(403).json(error(403, "Email já cadastrado"))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const updateUser = async (req, res) => {
  const { email, password, name, role } = req.body
  const { uid } = req.params
  if (!email || !password) {
    res.status(400).json(error(400, "Email ou senha não fornecido"))
  } else {
    try {
      const user = await models.Users.findOne({ where: { id: uid, email } });
      const userData = user.dataValues
      if (!user) {
        res.status(404).json(error(404, `Usuário(a) de ${uid} com email ${email} não existe`))
      } else {
        if (name === userData.name && role === userData.role) {
          res.status(400).json(error(400, "Não há alterações para serem aplicadas"))
        } else {
          if (name) {
            userData.name = name
          }
          if (role) {
            userData.role = role
          }
          await models.Users.update(userData, {
            where: {
              id: uid
            }
          });
          res.status(200).json(rebuildObj([user])[0])
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  deleteUser,
  getAllUsers,
  getUser,
  postUser,
  updateUser
}
