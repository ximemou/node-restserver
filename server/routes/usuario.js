const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();
const bodyParser = require('body-parser');

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    limite = Number(limite);
    desde = Number(desde);
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error: error
                });
            }
            Usuario.count({ estado: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cantidad: conteo
                });
            });

        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((error, usuarioDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }

        //usuarioDB.password = null;
        res.json({
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, usuarioDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', function(req, res) {


    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    // Con esto lo borramos de la bd: Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
    // con esto hacemos un borrado logico cambiando el estado a false
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (error, usuarioBorrado) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No existe el usuario a borrar'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;