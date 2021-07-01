const express = require('express');
const app = express();
const Persona = require('../models/persona');
const Jwt = require('jsonwebtoken');
const Bcrypt = require('bcrypt');

app.post('/', (req, res) => {
    let body = req.body;

    Persona.findOne({ strCorreo: body.strCorreo, blnActivo: true }, (err, usrDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usrDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o contraseña incorrecta'
                }
            });
        }
        if (usrDB.strContrasena) {
            if (!Bcrypt.compareSync(body.strContrasena, usrDB.strContrasena)) {
                return res.status(400).json({
                    ok: false,

                    err: {
                        message: 'Usuario y/o contraseña incorrecta'
                    }
                });
            }

            let token = Jwt.sign({
                usuario: usrDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            return res.status(200).json({
                ok: true,
                usuario: usrDB,
                token
            });
        } else {
            return res.status(400).json({
                ok: false,

                err: {
                    message: 'El usuario no cuenta con una contraseña'
                }
            });
        }


    });
});
module.exports = app;