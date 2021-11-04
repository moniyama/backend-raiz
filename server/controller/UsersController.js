const bcrypt = require('bcryptjs');
const models = require('../db/models')
const jwt = require('jsonwebtoken')
const { usersErrors, rebuildObj } = require('../../utils')

const deleteUser = async (req, res, next) => {
  const { uid } = req.params
  const restaurant = res.locals.user.dataValues.restaurant

  try {
    const user = await models.Users.findByPk(uid);
    if (!user) {
      return next(usersErrors.notFound)
    }
    const { restaurant: userRestaurant } = user.dataValues
    if (userRestaurant !== restaurant) {
      return next(usersErrors.denyAccess)
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
    return next(err);
  }
}

const getAllUsers = async (req, res, next) => {
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

const getUser = async (req, res, next) => {
  const restaurant = res.locals.user.dataValues.restaurant
  const { uid } = req.params

  try {
    const user = await models.Users.findByPk(uid)
    if (!user) {
      return next(usersErrors.notFound)
    }
    const userBelongsToSameRestaurant = user.dataValues.restaurant === restaurant
    if (!userBelongsToSameRestaurant) {
      return next(usersErrors.denyAccess)
    }
    return res.status(200).json(rebuildObj([user])[0])
  } catch (err) {
    return next(err);
  }
}

const postUser = async (req, res, next) => {
  const { email, password, name, role, restaurant } = req.body
  try {
    if (!email || !password || !role || !restaurant) {
      return next(usersErrors.missingData)
    }
    const hasUser = await models.Users.findOne({ where: { email } })
    if (hasUser) {
      return next(usersErrors.emailInUse)
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
    return next(err);
  }
}

const updateUser = async (req, res, next) => {
  const { name, role } = req.body
  const { uid } = req.params
  const localUserData = res.locals.user.dataValues

  try {
    if (!name && !role) {
      return next(usersErrors.missingData)
    }
    const user = await models.Users.findByPk(uid)
    if (!user) {
      return next(usersErrors.notFound)
    } else {
      const { name: userName, role: userRole, restaurant } = user.dataValues
      if (localUserData.restaurant !== restaurant) {
        return next(usersErrors.denyAccess)
      }
      if (userName === name && userRole === role || !name && userRole === role || !role && userName === name) {   // se role e name 
        return next(usersErrors.noDataChange)
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
    return next(err);
  }
}

module.exports = {
  deleteUser,
  getAllUsers,
  getUser,
  postUser,
  updateUser
}
