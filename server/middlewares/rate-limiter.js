const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 50, // numero de requisições permitidas por IP no tempo definido acima
    message: 'Muitas requisições foram feitas em sequência, por favor tente novamente dentro de 5 minutos.'
});

module.exports = limiter;