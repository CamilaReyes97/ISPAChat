/* CONECTADO LA BASE DE DATOS, HTTP, CONFIGURACION */
var bodyparser=require("body-parser"); //traer los metodos http
var mongoose= require("mongoose"); //Me permite hacer la conexion a la base de datos

//creamos el puerto
var port= process.env.PORT || 4201;

//Inicializar express
var express= require("express");
var app= express() //Llamo la funcion de express

var user_routes= require('./routes/user') //Llamamos el archivo de nuestras rutas
var message_routes= require('./routes/message') //llamamos las rutas



//Creamos el servidor para que trabaje con los metodos http y las funciones de expres
var server= require("http").createServer(app)
 //Envio de datos en tiempo real utilizando el servidor
var io= require('socket.io')(server);

//Utilizo socket para validar si estoy conectado al servidor (caso whatsapp si estoy en linea)
io.on('connection', function(socket){
    console.log('User connected');
    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
    socket.on('save-message', function (new_msm) {
        io.emit('new-message', { message: new_msm });
    });
    
    socket.on('save-user', function (user) {
        io.emit('new-user', {user:user});
    });

    socket.on('save-users', function (users) {
        io.emit('new-users', {users});
    });
})

//Conexion a la BD, primero la url donde mongo funciona,
mongoose.connect('mongodb://localhost:27017/messengerdb', (err)=>{
    if (err) { //SI HAY UN ERROR
        throw err; //Me muereste especificamente el error que hay
    } else { //Si nos conectamos bien
        console.log("Conectados a la BD")
        server.listen(port, function(){ //En que puerto estamos
            console.log("Estamos trabajando en el puerto " + port)
        })
    }
});

app.use(bodyparser.urlencoded({extended: true})) //Aqui viaja el cuerpo de la peticion, en este caso el registro del formulario
app.use(bodyparser.json()) //Le decimos que el formato de envio de datos va a ser un JSON

app.use((req, res, next) => {
    res.header('Content-Type: application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
});
  


app.use('/api', user_routes ) //Que en nuestra aplicacion vamos a utilizar esas rutas
app.use('/api', message_routes)
module.exports=app;



