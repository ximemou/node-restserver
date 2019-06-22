const express = require('express');
const app = express();


var meli = require('mercadolibre');


var meliObject = new meli.MELI(process.env.MERCADO_CLIENT);


app.use(require('./loginMercadoLibre'));

MELI.init({
    client_id: process.env.MERCADO_CLIENT,
    xauth_protocol: "https://",
    xauth_domain: "secure.mlstatic.com",
    xd_url: "/org-img/sdk/xd-1.0.4.html"
  });

  MELI.login(function() {
    console.log('usuario logueado');
  });

app.post('/loginMercadoLibre', (req,res) =>{


});

module.exports = app;