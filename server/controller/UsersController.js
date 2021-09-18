const bcrypt = require('bcryptjs');
const models = require('../db/models')
const jwt = require('jsonwebtoken')

const rebuildObj = (arr) => {
  return arr.map(obj => {
    delete obj.dataValues.password
    return obj
  })
}

const deleteUser = async (req, res) => {
  const { uid } = req.params
  const restaurant = res.locals.user.dataValues.restaurant
  const errors = {
    notFound: { code: 404, message: 'Usuario(a) não encontrado' },
    denyAccess: { code: 403, message: "Acesso negado. Usuário não pertence ao restaurante" }
  }
  try {
    const user = await models.Users.findByPk(uid);
    if (!user) {
      throw (errors.notFound)
    }
    const { restaurant: userRestaurant } = user.dataValues
    if (userRestaurant !== restaurant) {
      throw (errors.denyAccess)
    }
    const deleteUser = await models.Users.destroy({
      where: {
        id: uid
      }
    })
    if (deleteUser === 1) {
      return res.status(200).json(rebuildObj([user])[0])
    }
  } catch (err) {
    return res.status(err.code).json(err);
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
    return res.status(200).json(rebuildObj(users))
  } catch (error) {
    console.log(error)  // not happens
  }
}

const getUser = async (req, res) => {
  const restaurant = res.locals.user.dataValues.restaurant
  const { uid } = req.params
  const errors = {
    notFound: { code: 404, message: 'Usuario(a) não encontrado' },
    denyAccess: { code: 403, message: "Acesso negado. Usuário não pertence ao restaurante" }
  }

  try {
    const user = await models.Users.findByPk(uid)
    if (!user) {
      throw (errors.notFound)
    }
    const userBelongsToSameRestaurant = user.dataValues.restaurant === restaurant
    if (!userBelongsToSameRestaurant) {
      throw (errors.denyAccess)
    }
    return res.status(200).json(rebuildObj([user])[0])
  } catch (err) {
    return res.status(err.code).json(err);
  }
}

const postUser = async (req, res) => {
  const { email, password, name, role, restaurant } = req.body
  const errors = {
    missingData: { code: 400, message: "email, password, role ou restaurant não fornecido" },
    emailInUse: { code: 403, message: "Email já cadastrado" }
  }
  try {
    if (!email || !password || !role || !restaurant) {
      throw (errors.missingData)
    }
    const hasUser = await models.Users.findOne({ where: { email } })
    if (hasUser) {
      throw (errors.emailInUse)
    }
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
    return res.status(200).json(rebuildObj([user])[0])
  } catch (err) {
    return res.status(err.code).json(err);
  }
}

const updateUser = async (req, res) => {
  const { name, role } = req.body
  const { uid } = req.params
  const localUserData = res.locals.user.dataValues

  const errors = {
    notFound: { code: 404, message: 'Usuario(a) não encontrado' },
    denyAccess: { code: 403, message: "Acesso negado. Usuário não pertence ao restaurante" },
    missingData: { code: 400, message: "email, password, role ou restaurant não fornecido" },
    noDataChange: { code: 400, message: "Não há alterações para serem aplicadas" }
  }

  try {
    if (!name && !role) {
      throw (errors.missingData)
    }
    const user = await models.Users.findByPk(uid)
    if (!user) {
      throw (errors.notFound)
    } else {
      const { name: userName, role: userRole, restaurant } = user.dataValues
      if (localUserData.restaurant !== restaurant) {
        throw (errors.denyAccess)
      }
      if (userName === name && userRole === role || !name && userRole === role || !role && userName === name) {   // se role e name 
        throw (errors.noDataChange)
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
      return res.status(200).json(rebuildObj([updatedUser])[0])
    }
  } catch (err) {
    return res.status(err.code).json(err);
  }
}

module.exports = {
  deleteUser,
  getAllUsers,
  getUser,
  postUser,
  updateUser
}
