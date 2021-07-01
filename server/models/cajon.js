
const mongoose = require('mongoose');

let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'cajon'
};


let cajonSchema = new mongoose.Schema({
    nmbCajon: {
        type: Number,
        required: [true, 'Favor de ingresa el numero de cajón']
    },
    strDescripcion: {
        type: String,
        required: [true, 'Favor de ingresa una descripción del cajón']
    },
    blnRentado: {
        default: false,
        type: Boolean
    },
    blnActivo: {
        type: Boolean,
        default: true
    }

}, schemaOptions);


module.exports = mongoose.model('cajon', cajonSchema);