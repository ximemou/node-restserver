require('./config/config');
const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (error, resp) => {
    if (error) throw error;
    console.log('Base de datos online');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando en el purto: ', 3000);
});