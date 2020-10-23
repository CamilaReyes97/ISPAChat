var express= require('express');
var app= express.Router(); //Me permite crear las rutas donde viajara la informacion

var userController= require('../controllers/userController') //Requerimos el archivo que acabamos de crear

app.post('/registrar', userController.registrar) //Creamos la ruta que nos permitira registrar
app.post('/login', userController.login) //Creamos la ruta login
app.get('/usuario/:id', userController.get_user) //Creamos la ruta para traer la informacion de esa persona


module.exports= app;