const express = require('express');
const app = express();

app.use('/persona', require('./persona'));
app.use('/vehiculo', require('./vehiculo'));
app.use('/cajon', require('./cajon'));
app.use('/carga', require('./upload'));
app.use('/imagen', require('./imagen'));
app.use('/login', require('./login'));
app.use('/cajonVehiculo', require('./cajonVehiculo'));
module.exports = app;