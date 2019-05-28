const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req,res) =>{

  let body = req.body;
  Usuario.findOne( {email: body.email}, (err,usuarioDb)=>{
     
    if(err){
        return res.status(500).json({
            ok:false,
            err
        });
    }
    if(!usuarioDb){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Usuario o contraseña incorrectos'
            }
        });
    }

    if( !bcrypt.compareSync(body.password, usuarioDb.password)){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Usuario o contraseña incorrectos'
            }
        });

    }
    let token = jwt.sign({
       usuario:usuarioDb
    },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN })

     res.json({
        ok: true,
        usuario: usuarioDb,
        token:token
    });

  });
});

//Cofiguraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google:true
    }

  }

app.post('/google', async (req,res) =>{

    let token = req.body.idtoken;
    
    let googleUser = await verify(token)
                     .catch( error => {
                         return res.status(403).json({
                             ok:false,
                             error: error
                         });
                     });

    Usuario.findOne({email: googleUser.email}, (error, usuarioDB) =>{
        if(error){
            return res.status(500).json({
                ok:false,
                error
            });
        }

        if(usuarioDB) {
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    error:{
                        message : 'Ud ya se registro sin google'
                    }
                });
            }else{
                let token = jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });
            }

        } else{
            // si el usuario no existe en nuestra bd

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((error,usuarioDB) =>{
               if(error){
                   return res.status(500).json({
                       ok:false,
                       error
                   });
               };

               let token = jwt.sign({
                usuario:usuarioDB
            },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

            return res.json({
                ok:true,
                usuario:usuarioDB,
                token
            });
            });
        }

    });


   // res.json({
     //   usuario:googleUser
   // })
});



module.exports = app;