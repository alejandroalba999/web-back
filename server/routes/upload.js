const express = require('express');
const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');
const path = require('path');
// const { verificaToken } = require('../middlewares/autenticacion');
const fs = require('fs');
const app = express();
const del = require('del');

const Persona = require('../models/persona');
const Vehiculo = require('../models/vehiculo');
app.use(fileUpload());

//http://localhost:3000/api/carga/?ruta=personas&id=60c0c0f9c50471273ccf3678

app.put('/', (req, res) => {// [verificaToken], (req, res) => {
    let id = req.query.id;
    let ruta = req.query.ruta;
    let archivo = req.files.archivo ? req.files.archivo : null;
    // archivo unico y guardarlo con extension del archivo.name
    if (!req.files || archivo == null) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    let nombre = uniqid() + path.extname(archivo.name);
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


app.delete('/eliminar', async (req, res) => {
    let id = req.query.id;
    let ruta = req.query.ruta;
    let strNombre = req.query.strNombre;

    switch (ruta) {
        case 'vehiculos':
            const borradoServerVehiculo = borrarArchivo(strNombre, ruta);
            if (borradoServerVehiculo) {
                const deleteVehiculo = await Vehiculo.updateOne({ _id: id }, { $pull: { strImg: strNombre } });
                if (deleteVehiculo) {
                    return res.status(200).json({
                        cont: {
                            msg: `La imagen ${strNombre} fue eliminada con exito`
                        }
                    })
                } else {
                    return res.status(400).json({
                        cont: {
                            msg: `Error al eliminar la imagen ${strNombre}`
                        }
                    })
                }
            }

            break;
        case 'personas':

            const borradoServerPersona = borrarArchivo(strNombre, ruta);
            if (borradoServerPersona) {
                const deletePersona = await Persona.updateOne({ _id: id }, { $pull: { strImg: strNombre } });
                if (deletePersona) {
                    return res.status(200).json({
                        cont: {
                            msg: `La imagen ${strNombre} fue eliminada con exito`
                        }
                    })
                } else {
                    return res.status(400).json({
                        cont: {
                            msg: `Error al eliminar la imagen ${strNombre}`
                        }
                    })
                }
            }

            break;

        default:
            return res.status(400).json({
                msg: 'no se encontro la ruta'
            })
            break;
    }

})

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
        usr.strImg.push(nombreImagen);

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

async function borrarArchivo(nombreImagen, ruta) {
    let pathImg = path.resolve(`./uploads/${ruta}/${nombreImagen}`);
    const deletedFilePaths = await del([pathImg]);
    return deletedFilePaths;

}


module.exports = app;