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

function errorHandler(err, req, res, next) {
  const { code, message } = err
  return res.status(code).json({ code, message })
}

module.exports = {
  authErrors,
  ordersErrors,
  productsErrors,
  usersErrors,
  errorHandler
}