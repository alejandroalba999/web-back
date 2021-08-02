const express = require('express');
const _ = require('underscore');
const ControlPago = require('../models/controlPago'); //subir nivel
const app = express();

app.get('/', (req, res) => {
    ControlPago.aggregate([
        {
            $lookup:
            {
                from: "vehiculo",
                localField: "idVehiculo",
                foreignField: "_id",
                as: "vehiculo"
            },
        },

        {
            $lookup: {
                from: "cajon",
                localField: "vehiculo.idCajon",
                foreignField: "_id",
                as: "cajon"
            }
        },
        {
            $lookup: {
                from: "persona",
                localField: "vehiculo.idPersona",
                foreignField: "_id",
                as: "persona"
            }
        },
        {
            $project:
            {
                "_id": 1,
                "nmbCantidad": 1,
                "vehiculo._id": 1,
                "vehiculo.strMarca": 1,
                "vehiculo.strModelo": 1,
                "vehiculo.idPersona": 1,
                "vehiculo.idCajon": 1,
                "cajon.nmbCajon": 1,
                "persona.strNombre": 1,
                "persona.strPrimerApellido": 1,
                "persona.strSegundoApellido": 1
            }
        },
        {
            $group: {
                nmbPagosRealizados: { $sum: 1 },
                cantidad: { $sum: { $multiply: [1, "$nmbCantidad"] } },
                _id: { vehiculo: "$vehiculo", cajon: "$cajon", persona: "$persona" },
            }
        },
        { $sort: { '_id.cajon.nmbCajon': 1 } }


    ]).then((controlPago) => {
        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Success: Informacion obtenida correctamente.',
            cont: {
                controlPago,
                count: controlPago.length
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
    ControlPago.find({ blnActivo: blnActivo }).sort({ created_at: -1 })
        //solo aceptan valores numericos
        .then((controlPago) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    controlPago,
                    count: controlPago.length
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

app.get('/obtenerIdVehiculo/:id', (req, res) => {
    let id = req.params.id;
    if (id == null || id == undefined) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'No se recibio un identificador',
        });
    }
    ControlPago.find({ idVehiculo: id })
        //solo aceptan valores numericos
        .then((controlPago) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    controlPago
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
    ControlPago.find({ _id: id })
        //solo aceptan valores numericos
        .then((controlPago) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    controlPago
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
    let dteFechaPagoInicio = req.body.dteFechaPagoInicio ? req.body.dteFechaPagoInicio : null;
    let dteFechaPagoFin = req.body.dteFechaPagoFin ? req.body.dteFechaPagoFin : null;
    let idVehiculo = req.body.idVehiculo ? req.body.idVehiculo : null;

    if (dteFechaPagoFin == null || dteFechaPagoInicio == null || idVehiculo == null) {
        return res.status(400).json({
            msg: 'No se recibio el valor de uno o más campos',
            cont: {
                idVehiculo, dteFechaPagoInicio, dteFechaPagoFin
            }
        })
    }
    const pagoFecha = await ControlPago.find({
        idVehiculo: idVehiculo, dteFechaPagoInicio: dteFechaPagoInicio, dteFechaPagoFin: dteFechaPagoFin
    })

    const pago = await ControlPago.find({
        idVehiculo: idVehiculo,
        $or: [{
            dteFechaPagoInicio: { $gte: dteFechaPagoInicio, $lt: dteFechaPagoFin },
            dteFechaPagoFin: { $gte: dteFechaPagoInicio, $lt: dteFechaPagoFin },
        }]
    })
    if (pago.length > 0 || pagoFecha.length > 0) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'El rango de fecha de pago ya se encuentra registrado',
            cont: {
                pago: pago.length > 0 ? pago : pagoFecha
            }
        })
    } else {
        let controlPago = new ControlPago(req.body);
        controlPago.save().then((controlPagos) => {
            if (controlPagos === null) {
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
                        controlPagos
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
    }

});

app.put('/', async (req, res) => {
    let id = req.body._id;
    let body = _.pick(req.body, ['idVehiculo', 'nmbCantidad', 'dteFechaPagoInicio', 'dteFechaPagoFin']); //FILTRAR del body, on el pick seleccionar los campos que interesan del body
    //id 'su coleccion, new -> si no existe lo inserta, runVali-> sirve para validar todas las condiciones del modelo 

    if (id == null || id == undefined) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'No se recibio un identificador',
        });
    }

    ControlPago.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
        .then((controlPago) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion actualizada correctamente.',
                cont: {
                    controlPago
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
    // if (req.params.blnRentado) req.params.blnRentado = req.params.blnRentado

    ControlPago.findByIdAndUpdate(id, { blnActivo: blnActivo }, { new: true, runValidators: true, context: 'query' })
        .then((controlPago) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Informacion ${blnActivo == 'true' ? 'activada' : 'desactivada'} correctamente`,
                cont: {
                    controlPago
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