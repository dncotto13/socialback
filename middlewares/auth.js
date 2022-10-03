const { generateError } = require("../helpers");
const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (!authorization) {
            throw generateError('Falta la cabecera de Authorization', 401);
        }

        // Comprobación de que el token sea el correcto
        let token;

        try {
            token = jwt.verify(authorization, process.env.SECRET);
        } catch {
            throw generateError('Token incorrecto', 401);
        }

        console.log(token);

        // Metemos la información del token en la request para usarla en el controlador
        req.auth = token.id;

        // Saltamos al controlador
        next();
    } catch (error) {
        next(error);
    }
};


module.exports = {
    authUser,
};