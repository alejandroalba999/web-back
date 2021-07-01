const mongoose = require('mongoose');

let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'vehiculo'
};


let vehiculoSchema = new mongoose.Schema({

    strMarca: {
        type: String,
        required: [true, 'Favor de ingresar la marca del vehiculo']

    },
    strModelo: {
        type: String,
        required: [true, 'Favor de ingresar el modelo del vehiculo']

    },
    nmbAño: {
        type: String,
        required: [true, 'Favor de ingresar el año del vehiculo']
    },
    strPlacas: {
        type: String,
        required: [true, 'Favor de ingresar el numero de placas del vehiculo']
    },
    strNumeroSerie: {
        type: String
    },
    strColor: {
        type: String,
        required: [true, 'Favor de ingresa el color del vehiculo']
    },
    strDescripcion: {
        type: String,
        required: [true, 'Favor de ingresa alguna descripción del vehiculo']
    },
    strImg: {
        type: String,
        default: "img.jpg"
    },
    idPersona: {
        type: mongoose.Types.ObjectId,
        ref: 'persona',
        required: [true, 'Favor de ingresa el identificador de la persona para el vehiculo']
    },
    idCajon: {
        type: mongoose.Types.ObjectId,
        ref: 'cajon',
        required: [true, 'Favor de ingresa el identificador del cajon para el vehiculo']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }

}, schemaOptions);


module.exports = mongoose.model('vehiculo', vehiculoSchema);