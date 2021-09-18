const errors = {
  auth: {
    missingData: { code: 400, message: "Dados insuficientes" },
    invalidCredentials: { code: 400, message: "email ou senha inválido" }
  },
  orders: {
    notFound: { code: 404, message: 'Ordem não encontrada' },
    denyAccess: { code: 403, message: "Acesso negado. Order não pertence ao restaurante" },
    missingData: { code: 400, message: "Dados insuficientes" },
    missingProductData: { code: 400, message: "Dados de produto insuficientes" },
    noDataChange: { code: 400, message: "Não há alterações para serem aplicadas" }
  },
  products: {
    notFound: { code: 404, message: 'Produto não encontrado' },
    missingData: { code: 400, message: 'não foi indicado name ou price' },
  },
  users: {
    notFound: { code: 404, message: 'Usuario(a) não encontrado' },
    denyAccess: { code: 403, message: "Acesso negado. Usuário não pertence ao restaurante" },
    missingData: { code: 400, message: "Dados insuficientes" },
    emailInUse: { code: 403, message: "Email já cadastrado" },
    noDataChange: { code: 400, message: "Não há alterações para serem aplicadas" }
  }
}

const authErrors = errors.auth
const ordersErrors = errors.orders
const productsErrors = errors.products
const usersErrors = errors.users

function deleteProps(obj, props) {
  for (const prop of props) {
    (delete obj[prop]);
  }
}

function rearrangeOrdersObject(array) {
  return array.map(obj => {
    deleteProps(obj.dataValues, ["User"])
    obj.dataValues.Products.forEach(product => {
      product.dataValues.qtd = product.dataValues.ProductsOrders.dataValues.qtd
      deleteProps(product.dataValues,
        ["ProductsOrders", "image", "type", "sub_type", "createdAt", "updatedAt", "price"]
      )
    })
    return obj
  })
}

function rebuildObj (arr) {
  return arr.map(obj => {
    delete obj.dataValues.password
    return obj
  })
}

module.exports = {
  authErrors,
  ordersErrors,
  productsErrors,
  usersErrors,
  rearrangeOrdersObject,
  rebuildObj
}
