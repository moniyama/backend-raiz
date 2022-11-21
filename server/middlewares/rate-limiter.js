const rateLimit = require('express-rate-limit')
const { toMinutes } = require('../../utils');

const limiter = rateLimit({
    windowMs: toMinutes(5),
    max: 50, // numero de requisições permitidas por IP no tempo definido acima
    message: 'Muitas requisições foram feitas em sequência, por favor tente novamente dentro de 5 minutos.'
});

module.exports = limiter;