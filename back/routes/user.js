var express= require('express');
var app= express.Router(); //Me permite crear las rutas donde viajara la informacion

var userController= require('../controllers/userController') //Requerimos el archivo que acabamos de crear

app.post('/registrar', userController.registrar) //Creamos la ruta que nos permitira registrar

module.exports= app;