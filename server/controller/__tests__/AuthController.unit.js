const { createToken } = require('../AuthController')
const models = require('../../db/models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn()
  }
})

jest.mock('bcryptjs', () => {
  return {
    compare: jest.fn()
  }
})

jest.mock('../../db/models', () => {
  return {
    Users: {
      findOne: jest.fn()
    }
  }
})

afterEach(() => {
  // usando jest.clearAllMocks para facilitar
  // ao invés de limpar cada uma das duas funções 
  console.log('hook after each')
  jest.clearAllMocks();
});


describe('auth controller', () => {
  it('retorna um erro 400 quando o email é vazio', async () => {
    const req = {
      body: {
        email: '',
        password: 'senha-super-secreta'
      }
    };
    // criamos o objeto da resposta, com as funções
    // e cada função retorna o próprio objeto res
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };

    await createToken(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      code: 400,
      message: "email/senha não fornecido"
    })
  });

  it('retorna um erro 400 quando a senha é vazia', async () => {
    const req = {
      body: {
        email: 'user@email.com',
        password: ''
      }
    };
    // criamos o objeto da resposta, com as funções
    // e cada função retorna o próprio objeto res
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };

    await createToken(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      code: 400,
      message: "email/senha não fornecido"
    })
  });

  it('retorna o token criado', async () => {
    const req = {
      body: {
        email: 'user@email.com',
        password: 'senha-super-secreta'
      }
    };
    // criamos o objeto da resposta, com as funções
    // e cada função retorna o próprio objeto res
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };

    const user = {
      dataValues: {
        password: "senha-super-secreta"
      }
    }

    jwt.sign.mockReturnValueOnce("token")
    models.Users.findOne.mockReturnValueOnce(user)
    bcrypt.compare.mockReturnValueOnce(true)
    await createToken(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ token: "token" });
  
  });
})

