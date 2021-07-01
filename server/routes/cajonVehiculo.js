const express = require('express');
const _ = require('underscore');
const Cajon = require('../models/cajon'); //subir nivel
const app = express();

app.delete('/:_id', async (req, res) => {
    let _id = req.params._id;
    Cajon.updateOne({ _id: _id }, { $set: { blnRentado: false } })
        .then((cajones) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Información desactivada correctamente`,
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