var Message = require('../models/message'); //Traigo el modelo del mensaje

function send(req, res) {
    var data = req.body;  //recibe todo el cuerpo del mensaje
    var message = new Message(); //Traigo el modelo
    message.de = data.de;
    message.para = data.para;//el para del modelo y el para del formulario
    message.msm = data.msm;

    message.save((err, message_save) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' })
        } else {
            if (message_save) { //si fue guardado correctamente
                res.status(200).send({ message: message_save })
                //me va a devolver el cuerpo del mensaje
            }
        }
    })
}

function data_msm(req, res) {
    var data = req.body; /* Guarda quien lo envio y quien lo recibio para mostrarlo en pantalla */
    var de = req.params['de']; //quien lo envio 
    var para = req.params['para']; //quien lo recibio

    const filtro = {
        '$or': [
            {
                '$and': [
                    {
                        'para': de
                    }, {
                        'de': para
                    }
                ]
            }, {
                '$and': [
                    {
                        'para': para
                    }, {
                        'de': de
                    }
                ]
            },
        ]
    }
    //[de: para: mensaje y la fecha, de: para: mensaje y la fecha,de: para: mensaje y la fecha ]
    Message.find(filtro).sort({ createAt: 1 }).exec(function (err, messages) {
        if (messages) { //si hay mensajes entre esas dos personas
            res.status(200).send({ messages: messages });
        } else { //SINO HAY MENSAJES
            res.status(404).send({ message: 'No hay ningun mensaje entre estos usuarios' })
        }
    })
}

module.exports = {
    send,
    data_msm
}
