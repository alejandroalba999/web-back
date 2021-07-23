const express = require('express');
const _ = require('underscore');
const Vehiculo = require('../models/vehiculo'); //subir nivel
const Cajon = require('../models/cajon');
const ObjectId = require('mongoose').Types.ObjectId;
const app = express();
const existAdmin = require('../config/rol');

app.get('/', async (req, res) => {
    if (req.query.blnActivo) req.query.blnActivo = req.query.blnActivo;
    let activoInactivo = req.query.blnActivo === 'false' ? false : true;
    try {
        const getVehiculos = await Vehiculo.aggregate([
            {
                $match: { blnActivo: activoInactivo }
            },
            {
                $lookup:
                {
                    from: "persona",
                    localField: "idPersona",
                    foreignField: "_id",
                    as: "persona"
                },

            },
            {
                $lookup:
                {
                    from: "cajon",
                    localField: "idCajon",
                    foreignField: "_id",
                    as: "cajon"
                }
            },
            { $sort: { created_at: -1 } }
        ])

        if (getVehiculos) {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    getVehiculos,
                    count: getVehiculos.length
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error: Error al obtener la api',
            cont: {
                error: error.message
            }
        });
    }

});

app.get('/obtenerSoloVehiculo', async (req, res) => {
    try {
        const obtenerCoche = await Vehiculo.find({ blnActivo: true }, { strModelo: 1, strMarca: 1 });
        if (obtenerCoche.length > 0) {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    obtenerCoche
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: error,
        });
    }

})

app.get('/obtenerId/:id', async (req, res) => {
    let id = req.params.id;
    try {
        if (id == null || id == undefined) {
            return res.status(500).json({
                ok: false,
                resp: 400,
                msg: 'No se recibio un identificador',
            });
        }
        const obtenerVehiculo = await Vehiculo.aggregate([
            { $match: { '_id': ObjectId(id) } },
            {
                $lookup:
                {
                    from: "persona",
                    localField: "idPersona",
                    foreignField: "_id",
                    as: "persona"
                },

            },
            {
                $lookup:
                {
                    from: "cajon",
                    localField: "idCajon",
                    foreignField: "_id",
                    as: "cajon"
                }
            }
        ])
        if (obtenerVehiculo) {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Informacion obtenida correctamente.',
                cont: {
                    obtenerVehiculo
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error: Error al obtener la api',
            cont: {
                err: error.message
            }
        });
    }
});

app.post('/', async (req, res) => {
    let cajon = req.body.idCajon;
    let auto = new Vehiculo(req.body);
    const encontrado = await Vehiculo.findOne({ strPlacas: req.body.strPlacas });
    const encontradoIdCajon = await Vehiculo.findOne({ idCajon: req.body.idCajon, blnActivo: true })
    if (encontradoIdCajon) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'El cajón ya se encuentra en uso',
        });
    }
    if (encontrado) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'Las placas ya han sido registradas',
        });
    }
    auto.save().then(async (autos) => {
        if (autos === null) {
            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error: Error al registrar la api',
                cont: {
                    err: err
                }
            });
        } else {
            // console.log(cajon);
            const cajonRentado = await Cajon.updateOne({ _id: cajon }, { $set: { blnRentado: true } });
            if (cajonRentado) {
                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Success: Informacion registrada correctamente.',
                    cont: {
                        autos
                    }
                })
            } else {
                return res.status(500).json({
                    ok: false,
                    resp: 500,
                    msg: 'Error: Error al registrar la api',
                    cont: {
                        err: error
                    }
                });
            }


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
    let body = _.pick(req.body, ['strColor', 'strPlacas', 'strDescripcion', 'nmbAño', 'strModelo', 'strMarca', 'idCajon', 'idPersona']); //FILTRAR del body, on el pick seleccionar los campos que interesan del body
    const encontradaPlaca = await Vehiculo.findOne({ _id: { $ne: id }, strPlacas: body.strPlacas })
    const encontrado = await Vehiculo.findOne({ _id: { $ne: id }, idCajon: body.idCajon, blnActivo: true });
    if (encontradaPlaca) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'Las placas ya ha se encuentran registradas',
        });
    }
    if (encontrado) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'El cajón ya ha se encuentra en uso',
        });
    }
    if (id == null || id == undefined) {
        return res.status(500).json({
            ok: false,
            resp: 400,
            msg: 'No se recibio un identificador',
        });
    }
    if (!req.body.anteriorCajonId) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'No se recibio un identificador anterior del cajón',
        })
    }
    Vehiculo.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
        .then(async (auto) => {
            if (req.body.anteriorCajonId) {
                await Cajon.updateOne({ _id: req.body.anteriorCajonId }, { $set: { blnRentado: false } })
            }
            const cajonRentado = await Cajon.updateOne({ _id: body.idCajon }, { $set: { blnRentado: true } });
            if (cajonRentado) {
                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Success: Informacion actualizada correctamente.',
                    cont: {
                        auto
                    }
                })
            }

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

app.delete('/:id/:blnActivo', async (req, res) => {
    let id = req.params.id;
    let blnActivo = req.params.blnActivo;
    if (blnActivo == 'true') {
        const Cajon = await Vehiculo.findOne({ _id: id }, { _id: 0, idCajon: 1 })
        const validarCajon = await Vehiculo.findOne({ _id: { $ne: id }, idCajon: Cajon.idCajon, blnActivo: true })
        if (validarCajon) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Ya se enuentra un vehiculo activo con este numero de cajón',
                cont: {
                    coincidencia: validarCajon
                }
            })
        } else {
            desactivar(id, blnActivo, res);
        }
    } else {
        desactivar(id, blnActivo, res);
    }
});

const desactivar = async (id, blnActivo, res) => {
    await Vehiculo.findByIdAndUpdate(id, { blnActivo: blnActivo }, { new: true, runValidators: true, context: 'query' })
        .then((auto) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Informacion ${blnActivo == 'true' ? 'activada' : 'desactivada'} correctamente`,
                cont: {
                    auto
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
}

module.exports = app;