const mongoose = require('mongoose');

let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'controlPago'
};


let controlPagoSchema = new mongoose.Schema({
    idVehiculo: {
        type: mongoose.Types.ObjectId,
        ref: 'vehiculo',
        required: [true, 'Favor de ingresar el identificador del vehiculo']
    },
    nmbCantidad: {
        type: Number,
        default: 470
    },
    dteFechaPagoInicio: {
        type: Date,
        required: [true, 'Favor de ingresar la fecha de pagar']
    },
    dteFechaPagoFin: {
        type: Date,
        required: [true, 'Favor de ingresar la fecha de pagar']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }

}, schemaOptions);


module.exports = mongoose.model('controlPago', controlPagoSchema);