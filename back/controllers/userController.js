/* Aqui es donde vamos a crear registros, modificaciones, eliminar */
var User= require('../models/user'); //Treamos el modelo que acabamos de crear
var bcrypt= require('bcrypt-nodejs'); //Incriptar las contraseñas
var jwt= require('../helpers/jwt') //Requerimos el token



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

function login(req, res) {
    var data= req.body; // recibe el usuario y la contraseña para despues compararlos

    //Si el correo existe, que lo traiga de la BD
    User.findOne({email: data.email}, (err, user_data)=>{
        if (err) {
            // 500- el servidor de whatsapp se cayo
            //404- NO se encuentra la persona o el mensaje
            //200- cuando se envia el mensaje correctamente
            res.status(500).send({message: "Error en el servidor"});
        } else {
            if (!user_data) { //user_data es el email que se ingreso en el login, si no se encuentra en la BD, no se ha registrado
                res.status(404).send({message: "El correo NO esta registrado"})
            }else{ //Si se encontro el correo en la BD
                bcrypt.compare(data.password, user_data.password, function(err,check){
                    if (check) { //si son iguales las contraseñas
                        if (data.gettoken) {
 
                            res.status(200).send({
                                jwt: jwt.createToken(user_data), //llamamos el token
                                user: user_data, //Me muestre la informacion del usuario
                                message: 'Este usuario tiene un token'
                            });

                        } else {
                            res.status(200).send({

                                jwt: jwt.createToken(user_data),
                                user: user_data, //Me muestre la informacion del usuario
                                message: 'Este usuario NO tiene un token'
                            });
                        }
                    } 

                })

            }
        }

    })
}
//Vamos a buscar un usuario para chatear con él o ella
function get_user(req, res){
    let id = req.params['id']; //Estoy guardando el id que estoy buscando 
        User.findById(id, (err, user)=>{
            if (err) {
                res.status(500).send({message: 'Error en el servidor'})
            } else { //Si encuentra una coincidencia
                if (user) { //si coincide, o existe
                    res.status(200).send({user:user}) //muestre me los datos del usuario
                } else { //No existe esa persona
                    res.status(500).send({message: 'No existe un usuario con ese id'})
                }
            }
        })
}


module.exports={
    registrar,
    login,
    get_user
}
