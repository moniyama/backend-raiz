const TOKEN = 'zr*qhTU3Ro!3k668XYPmX!TL4';

const internal = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer ', '');
    
    if (token !== TOKEN) {
        return res.status(403).json({ message: 'Token de autorização inválido' });
    }

    return next();
};

module.exports = internal;