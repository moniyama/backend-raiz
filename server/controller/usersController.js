// const bcrypt = require('bcrypt');
const models = require('../db/models')

const rebuildObj = (arr) => {
  return arr.map(obj => {
    const role = obj.role
    obj.role = {
      admin: obj.admin,
      task: role
    }
    delete obj.dataValues.admin
    return obj
  })
}

const deleteUser = async (req, res) => {
  // requer auth
  const { uid } = req.params
  try {
    const user = await models.Users.findOne({ where: { id: uid } });
    if (!user) {
      res.status(404).json(`usuaria solicitada não encontrada`)
    } else {
      const deleteUser = await models.Users.destroy({   // dá pra aproveitar o user??
        where: {
          id: uid
        }
      })
      if (deleteUser === 1) {
        res.status(200).json(rebuildObj([user]))
      }
    }
  } catch (error) {
    console.log(error)
    res.json("error")
  }
}

const getAllUsers = async (req, res) => {
  // requer auth
  // headers  
  try {
    const users = await models.Users.findAll({
      order: [
        ['id', 'ASC']
      ]
    })
    if (users.length > 0) {
      res.json(rebuildObj(users))
    } else {
      res.json('não tem usuarios')
    }
  } catch (error) {
    console.log(error)
    res.json("caiu no catch do get all users", error)
  }
}

const getUser = async (req, res) => {
  // requer auth
  const { uid } = req.params
  try {
    const user = await models.Users.findAll({
      where: {
        id: uid
      }
    })
    if (user.length > 0) {
      res.json(rebuildObj(user))
    } else {
      res.json('usuaria solicitada no existe')
    }
  } catch (error) {
    res.json('caiu no catch do getUser by id')
  }
}

const postUser = async (req, res) => {
  const { email, password, name, role, admin } = req.body

  if (email && password && (role.toLowerCase() === "hall" || role.toLowerCase() === "cook")) {
    try {
      // const saltRounds = 12;
      // bcrypt.hash({ email }, saltRounds, function (err, hash) {
      // console.log(hash)
      // Store hash in your password DB.
      const user = await models.Users.create({
        name,
        email,
        // password: hash,
        admin: admin || false,
        role: role.toLowerCase()
      });
      // });      
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log("falta campo a ser preenchido")
  }
  res.json({ email, password })
}

const updateUser = async (req, res) => {
  const { email, password, name, role, admin } = req.body
  const { uid } = req.params
  if (email && password && uid) {
    try {
      const user = await models.Users.findOne({ where: { id: uid } });
      let updatedUser = user.dataValues
      if (name) {
        updatedUser.name = name
      }
      if (role) {
        updatedUser.role = role
      }
      if (admin) {
        updatedUser.admin = admin
      }
      await models.Users.update(updatedUser, {
        where: {
          id: uid
        }
      });
      res.status(200).json(updatedUser)
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json("não tem senha, email ou id")
  }
}

module.exports = {
  deleteUser,
  getAllUsers,
  getUser,
  postUser,
  updateUser
}
