const express = require('express');
const _ = require('underscore');
const Cajon = require('../models/cajon'); //subir nivel
const app = express();

app.get('/', (req, res) => {
    Cajon.find({}).sort({ nmbCajon: -1 })
        //solo aceptan valores numericos
        .then((cajon) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    cajon,
                    count: cajon.length
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
app.get('/:blnActivo', (req, res) => {
    let blnActivo = req.params.blnActivo;
    Cajon.find({ blnActivo: blnActivo, blnRentado: false }).sort({ nmbCajon: -1 })
        //solo aceptan valores numericos
        .then((cajon) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    cajon,
                    count: cajon.length
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
    Cajon.find({ _id: id })
        //solo aceptan valores numericos
        .then((cajon) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    cajon
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
    let cajon = new Cajon(req.body);
    const encontrado = await Cajon.findOne({ nmbCajon: req.body.nmbCajon });
    if (encontrado) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'El cajón ya ha sido  registrado',
        });
    }
    cajon.save().then((cajones) => {
        if (cajones === null) {
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
                    cajones
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




app.put('/', async (req, res) => {
    let id = req.body._id;
    let body = _.pick(req.body, ['nmbCajon', 'strDescripcion']); //FILTRAR del body, on el pick seleccionar los campos que interesan del body
    //id 'su coleccion, new -> si no existe lo inserta, runVali-> sirve para validar todas las condiciones del modelo 

    if (id == null || id == undefined) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'No se recibio un identificador',
        });
    }
    const encontrado = await Cajon.findOne({ _id: { $ne: id }, nmbCajon: req.body.nmbCajon });
    if (encontrado) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'El cajón ya ha sido  registrado',
        });
    }
    Cajon.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
        .then((cajones) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion actualizada correctamente.',
                cont: {
                    cajones
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

app.delete('/:_id/:blnActivo', (req, res) => {
    let id = req.params._id;
    let blnActivo = req.params.blnActivo;
    // if (req.params.blnRentado) req.params.blnRentado = req.params.blnRentado;
    console.log(id);

    Cajon.findByIdAndUpdate(id, { blnActivo: blnActivo }, { new: true, runValidators: true, context: 'query' })
        .then((cajones) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Informacion ${blnActivo == 'true' ? 'activada' : 'desactivada'} correctamente`,
                cont: {
                    cajones
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