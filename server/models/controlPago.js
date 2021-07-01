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
        default: null
    },
    nmbCantidad: {
        type: String,
        required: [true, 'Favor de ingresar la cantidad a pagar']
    },
    dteFechaPago: {
        type: Date,
        required: [true, 'Favor de ingresar la fecha de pagar']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }

}, schemaOptions);


module.exports = mongoose.model('controlPago', controlPagoSchema);