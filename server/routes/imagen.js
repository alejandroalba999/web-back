const express = require('express');
const fs = require('fs');
const path = require('path');
// const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

// http://localhost:3000/api/imagen?ruta=vehiculos&img=1wwu540kpsf881y.png
app.get('/', (req, res) => {
    let ruta = req.query.ruta;
    let img = req.query.img;
    let rutaImage = path.resolve(__dirname, `../../uploads/${ruta}/${img}`);
    let noImage = path.resolve(__dirname, `../assets/no-image-persona.png`);
    let noImageVehiculo = path.resolve(__dirname, `../assets/no-image-vehiculo.png`);

    if (fs.existsSync(rutaImage)) {
        // console.log("imagen encontrada");
        return res.sendFile(rutaImage);

    } else {
        // console.log(ruta);
        switch (ruta) {
            case 'personas':
                return res.sendFile(noImage);

            case 'vehiculos':
                return res.sendFile(noImageVehiculo);
            default:
                break;
        }


    }
});
module.exports = app;