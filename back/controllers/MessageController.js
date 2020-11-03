var Message= require('../models/message'); //Traigo el modelo del mensaje

function send(req, res) {
        var data= req.body;  //recibe todo el cuerpo del mensaje
        var message= new Message(); //Traigo el modelo
        message.de= data.de;
        message.para= data.para;//el para del modelo y el para del formulario
        message.msm= data.msm; 

        message.save((err, message_save)=>{
            if (err) {
                res.status(500).send({message: 'Error en el servidor'})
            } else {
              if (message_save) { //si fue guardado correctamente
                  res.status(200).send({message: message_save})
                  //me va a devolver el cuerpo del mensaje
              }  
            }
        })
}

module.exports={
    send
}