const express = require('express');
const _ = require('underscore');
const Persona = require('../models/persona'); //subir nivel
const Bcrypt = require('bcrypt');
const app = express();
const existAdmin = require('../config/rol');

app.get('/:blnActivo', (req, res) => {
    let blnActivo = req.params.blnActivo;
    Persona.find({ blnActivo: blnActivo }).sort({ _id: -1 })
        //solo aceptan valores numericos
        .then((persona) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    persona,
                    count: persona.length
                }
            });
        }).catch((err) => {
            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error: Error al obtener la api',
                cont: {
                    err: err.message
                }
            });
        })
});
app.get('/', existAdmin, (req, res) => {
    Persona.find({}).sort({ _id: -1 })
        //solo aceptan valores numericos
        .then((persona) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    persona,
                    count: persona.length
                }
            });
        }).catch((err) => {
            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error: Error al obtener la api',
                cont: {
                    err: err.message
                }
            });
        })
});

app.get('/obtenerId/:id', (req, res) => {
    let id = req.params.id;
    if (id == null || id == undefined) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'No se recibio un identificador',
        });
    }
    Persona.find({ _id: id })
        //solo aceptan valores numericos
        .then((persona) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    persona
                }
            });
        }).catch((err) => {
            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error: Error al obtener la api',
                cont: {
                    err: err.message
                }
            });
        })
});

app.post('/', async (req, res) => {
    if (req.body.strContrasena) req.body.strContrasena = Bcrypt.hashSync(req.body.strContrasena, 10);
    let persona = new Persona(req.body);
    const encontrado = await Persona.findOne({ strCorreo: req.body.strCorreo });
    if (encontrado) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'El correo electronico ya ha sido registrado',
        });
    }
    persona.save().then((personas) => {
        if (personas === null) {
            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error: Error al registrar la api',
                cont: {
                    err: err
                }
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion registrada correctamente.',
                cont: {
                    personas
                }
            })
        }
    }).catch((err) => {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error: Error al registrar la api',
            cont: {
                err: err
            }
        });
    })
});




app.put('/', (req, res) => {
    let id = req.body._id;
    let body = _.pick(req.body, ['strNombre', 'strDireccion', 'strPrimerApellido', 'strSegundoApellido', 'nmbTelefono', 'blnAdmin']); //FILTRAR del body, on el pick seleccionar los campos que interesan del body
    //id 'su coleccion, new -> si no existe lo inserta, runVali-> sirve para validar todas las condiciones del modelo 
    console.log(body);
    if (id == null || id == undefined) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'No se recibio un identificador',
        });
    }
    Persona.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
        .then((categoria) => {
            // console.log(categoria);
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion actualizada correctamente.',
                cont: {
                    categoria
                }
            })
        }).catch((err) => {
            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error: Error al actualizar la api',
                cont: {
                    err: err.message
                }
            });
        })

});

app.delete('/:id/:blnActivo', (req, res) => {
    let id = req.params.id;
    let blnActivo = req.params.blnActivo;

    Persona.findByIdAndUpdate(id, { blnActivo: blnActivo }, { new: true, runValidators: true, context: 'query' })
        .then((persona) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Informacion ${blnActivo == 'true' ? 'activada' : 'desactivada'} correctamente`,
                cont: {
                    persona
                }
            });
        }).catch((err) => {
            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error: Error al eliminar la informacion',
                cont: {
                    err: err.message
                }
            });
        })
});




module.exports = app;