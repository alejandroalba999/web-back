
process.env.PORT = process.env.PORT || 3000;
//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//Conecciona  a la base de datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    log = true;
    urlDB = 'mongodb://localhost:27017/estacionamiento'; //mongodb://localhost:27017/ruta
} else {
    urlDB = '';
}
process.env.URLDB = urlDB;
process.env.SEED = process.env.SEED || 'Frima-super-secreta';

process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '3h';
