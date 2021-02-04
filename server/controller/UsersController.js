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
  const restaurant = res.locals.user.dataValues.restaurant

  try {
    const user = await models.Users.findByPk(uid);
    if (!user) {
      res.status(404).json(error(404, 'usuario(a) não existe'))
    } else if(user.dataValues.restaurant !== restaurant) {
      res.status(403).json(error(403, 'Sem permissão. Usuário(a) pertence a outro restaurante'))
    } else {
      const deleteUser = await models.Users.destroy({
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
  const restaurant = res.locals.user.dataValues.restaurant
  try {
    const users = await models.Users.findAll({
      where: { restaurant: restaurant },
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
  const restaurant = res.locals.user.dataValues.restaurant
  const { uid } = req.params
  try {
    const user = await models.Users.findByPk(uid)

    if (user && user.dataValues.restaurant === restaurant) {
      res.status(200).json(rebuildObj([user])[0])
    } else {
      !user
        ? res.status(404).json(error(404, 'Usuario(a) não existe'))
        : res.status(403).json(error(403, "Acesso negado. Usuário não pertence ao restaurante"))
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
  const { name, role } = req.body
  const { uid } = req.params
  const localUserData = res.locals.user.dataValues
  if (!name && !role) {
    res.status(400).json(error(400, "Nenhum dado foi fornecido"))
  } else {
    try {
      const user = await models.Users.findByPk(uid)
      if (!user) {
        res.status(404).json(error(404, `Usuário(a) não existe`))
      } else {
        let userName = user.dataValues.name
        let userRole = user.dataValues.role
        if (localUserData.restaurant !== user.dataValues.restaurant) {
          res.status(403).json(error(403, "Acesso negado. Usuário não pertence ao restaurante"))
        }
        if (userName === name && userRole === role || !name && userRole === role || !role && userName === name) {   // se role e name 
          res.status(400).json(error(400, "Não há alterações para serem aplicadas"))
        }
        if (name && name !== userName) {
          user.dataValues.name = name
        }
        if (role && role !== userRole) {
          user.dataValues.role = role
        }
        await models.Users.update(user.dataValues, {
          where: {
            id: uid
          }
        });
        const updatedUser = await models.Users.findByPk(uid)
        res.status(200).json(rebuildObj([updatedUser])[0])
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
