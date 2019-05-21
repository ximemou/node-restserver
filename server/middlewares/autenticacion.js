const jwt = require('jsonwebtoken');

//Verificar token

let verificaToken =(req,res,next)=>{
   
  let token = req.get('token');  

  jwt.verify(token,process.env.SEED,(err,decoded) =>{
     if(err){
         return res.status(401).json({
             ok:false,
             error:{
                 message: 'Token no válido'
             }
         });
     }
     req.usuario = decoded.usuario;
     //para que continue llamo a next
     next();
  });

};


  //Verifica ADMIN_ROLE
  let verificaAdminRole = (re,res,next) => {
  
    let usuario = req.usuario;
    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            error:{
                message: 'El usuario no es administrador'
            }
        });
    }

  };

module.exports ={
    verificaToken,
    verificaAdminRole
};