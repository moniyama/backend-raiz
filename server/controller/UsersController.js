const bcrypt = require('bcryptjs');
const models = require('../db/models')
const jwt = require('jsonwebtoken')
const { usersErrors, rebuildObj } = require('../../utils')

const deleteUser = async (req, res) => {
  const { uid } = req.params
  const restaurant = res.locals.user.dataValues.restaurant

  try {
    const user = await models.Users.findByPk(uid);
    if (!user) {
      throw (usersErrors.notFound)
    }
    const { restaurant: userRestaurant } = user.dataValues
    if (userRestaurant !== restaurant) {
      throw (usersErrors.denyAccess)
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

  try {
    const user = await models.Users.findByPk(uid)
    if (!user) {
      throw (usersErrors.notFound)
    }
    const userBelongsToSameRestaurant = user.dataValues.restaurant === restaurant
    if (!userBelongsToSameRestaurant) {
      throw (usersErrors.denyAccess)
    }
    return res.status(200).json(rebuildObj([user])[0])
  } catch (err) {
    return res.status(err.code).json(err);
  }
}

const postUser = async (req, res) => {
  const { email, password, name, role, restaurant } = req.body
  try {
    if (!email || !password || !role || !restaurant) {
      throw (usersErrors.missingData)
    }
    const hasUser = await models.Users.findOne({ where: { email } })
    if (hasUser) {
      throw (usersErrors.emailInUse)
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

  try {
    if (!name && !role) {
      throw (usersErrors.missingData)
    }
    const user = await models.Users.findByPk(uid)
    if (!user) {
      throw (usersErrors.notFound)
    } else {
      const { name: userName, role: userRole, restaurant } = user.dataValues
      if (localUserData.restaurant !== restaurant) {
        throw (usersErrors.denyAccess)
      }
      if (userName === name && userRole === role || !name && userRole === role || !role && userName === name) {   // se role e name 
        throw (usersErrors.noDataChange)
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
