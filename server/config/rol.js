
const Persona = require('../models/persona');
const JWT = require('jsonwebtoken');

const existAdmin = async (req, res, next) => {
    // const existAdmin = await Persona.findOne({ blnAdmin: true });
    let user = JWT.decode(req.headers.authorization)
    if (user == null || user == undefined) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se recibio un token valido'
            }
        });

    } else {
        if (user.usuario.blnAdmin == true) {
            next()
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No cuenta con permisos de administrador'
                }
            });
        }
    }


}


module.exports = existAdmin;