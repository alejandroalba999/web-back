const express = require('express');
const _ = require('underscore');
const ControlPago = require('../models/controlPago'); //subir nivel
const app = express();


app.get('/:_id', async (req, res) => {
    let id = req.params._id ? req.params._id : null;
    if (id != null) {
        const ultimo = await ControlPago.findOne({ idVehiculo: id }).sort({ dteFechaPagoFin: -1 });
        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Success: Informacion obtenida correctamente.',
            cont: {
                ultimo
            }
        })
    } else {
        return res.status(400).json({
            ok: false,
            resp: 500,
            msg: 'No se recibio un identificador',
            cont: {
                id
            }
        });
    }

})

module.exports = app;