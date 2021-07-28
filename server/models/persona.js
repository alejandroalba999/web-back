const mongoose = require('mongoose');

let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'persona'
};

let personaSchema = new mongoose.Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de ingresa el nombre de la persona']
    },

    strPrimerApellido: {
        type: String,
        required: [true, 'Favor de ingresar el primer apellido de la persona']

    },
    strSegundoApellido: {
        type: String,
        required: [true, 'Favor de ingresar el segundo apellido de la persona']

    },
    strEstado: {
        type: String,
    },
    strPais: {
        type: String,
    },
    strDireccion: {
        type: String,
        required: [true, 'Favor de ingresar la direccion de la persona']

    },
    strCorreo: {
        type: String,
        required: [true, 'Favor de ingresar un correo electronico de la persona']

    },
    strContrasena: {
        type: String,
        required: [true, 'Favor de ingresar una contraseña para la persona']
    },
    nmbTelefono: {
        type: String,
        required: [true, 'Favor de ingresar teléfono']

    },
    blnAdmin: {
        type: Boolean,
        default: false
    },
    strImg: {
        type: String,
        default: "img.jpg"
    },
    blnActivo: {
        type: Boolean,
        default: true
    }

}, schemaOptions);


module.exports = mongoose.model('persona', personaSchema);