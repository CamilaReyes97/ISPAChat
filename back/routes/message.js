var express= require('express');
var messageController=require('../controllers/MessageController');


var api=express.Router();

api.post('/message/enviar', messageController.send)



module.exports=api;

