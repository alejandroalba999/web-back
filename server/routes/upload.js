const express = require('express');
const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');
const path = require('path');
// const { verificaToken } = require('../middlewares/autenticacion');
const fs = require('fs');
const app = express();

const Persona = require('../models/persona');
const Vehiculo = require('../models/vehiculo');
app.use(fileUpload());

//http://localhost:3000/api/carga/?ruta=personas&id=60c0c0f9c50471273ccf3678

app.put('/', (req, res) => {// [verificaToken], (req, res) => {
    let id = req.query.id;
    let ruta = req.query.ruta;
    let archivo = req.files.archivo;
    //archivo unico y guardarlo con extension del archivo.name
    let nombre = uniqid() + path.extname(archivo.name);

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    let validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg', 'img/jfif'];
    if (!validExtensions.includes(archivo.mimetype)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "solo exensiones <png,jpg,gif,jpeg, jfif> aon validas"
            }
        });
    }
    archivo.mv(`./uploads/${ruta}/${nombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    });
    switch (ruta) {

        case 'personas':
            imagenUsuario(id, res, nombre);
            break;
        case 'vehiculos':
            imagenVehiculo(id, res, nombre);
            break;
        default:
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Ruta no valida'
                }
            });
            break;
    }
});

//RETORNA AL USUARIO CON ID
//ayuda a actualizar el nombre de la imagen en la bd //valida que la consulta este bien hecha
function imagenUsuario(id, res, nombreImagen) {
    Persona.findById(id, (err, usr) => {
        if (err) {
            borrarArchivo(nombreImagen, 'personas');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //validar la respuesta
        if (!usr) {
            borrarArchivo(nombreImagen, 'personas');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        usr.strImg = nombreImagen;

        //Usuario.findByIdAndUpdate
        usr.save((err, usrDB) => {
            if (err) {
                borrarArchivo(nombreImagen, 'personas');
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                usrDB
            });
        });
    });
}
function imagenVehiculo(id, res, nombreImagen) {
    Vehiculo.findById(id, (err, usr) => {
        if (err) {
            borrarArchivo(nombreImagen, 'vehiculos');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //validar la respuesta
        if (!usr) {
            borrarArchivo(nombreImagen, 'vehiculos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        usr.strImg = nombreImagen;

        //Usuario.findByIdAndUpdate
        usr.save((err, usrDB) => {
            if (err) {
                borrarArchivo(nombreImagen, 'vehiculos');
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                usrDB
            });
        });
    });
}

function borrarArchivo(nombreImagen, ruta) {
    let pathImg = path.resolve(__dirname, `./uploads/${ruta}/${nombreImagen}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
    console.log('Imagen borrada con exito');
}
module.exports = app;