/* Aqui es donde vamos a crear registros, modificaciones, eliminar */
var User= require('../models/user'); //Treamos el modelo que acabamos de crear
var bcrypt= require('bcrypt-nodejs'); //Incriptar las contraseñas

function registrar(req , res) {
    var params= req.body; //Guarda la informacion de quien se esta registrando
    var user = new User(); //Vamos a utilizar siempre el mismo modelo

    user.nombre= params.nombre;
    user.email=params.email;
    user.imagen= null;
    user.telefono= '';
    user.bio='';
    user.curso='undefined';
    user.estado= false;
    //Si hay una contraseña en el envio de la peticion
    if (params.password) { //la vamos a encriptar
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password= hash; //Le digo que en el modelo de mongoDB se va almacenar la contraseña de una vez encriptada

            User.findOne({email: params.email}, (err, user_data)=>{
                if (!user_data) { //Si no hay un usuario registrado con ese correo, lo vamos a registrar
                    user.save((err, user)=>{
                            if (user) { //si el usuario se registra
                                //Me a devolver el objeto de usuario
                                res.status(200).send({user:user})
                            } else { //Sino se puede registrar el usuario
                                res.status(404).send({message: err})
                            }
                    })
                } else { //SI esta registrado
                    res.status(404).send({message: "El correo ya esta registrado"})
                }
            })
        });
    } else { //Si no hay una contraseña
        res.status(500).send({message: 'Ingrese su contraseña'})
    }
}

module.exports={
    registrar
}
