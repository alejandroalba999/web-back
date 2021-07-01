require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(express.json())

// Habilita CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, token'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});
//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//Parse formato a application/jason
app.use(bodyParser.json());
//Archivo agrupador de rutas
app.use('/api', require('./routes/index'));
//Conexion a la base de datos
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, resp) => {
    if (err) throw err,
        console.log('Base de datos Online');
});

//Puerto de escucha de la aplicacion
app.listen(process.env.PORT, () => {
    console.log('Escuchando por el puerto', process.env.PORT);
});

// esto es un codigo que resuelve mi tarea