//Vamos a importar una serie de modulos que nos va ayudar a nuestro servicio
import { Injectable } from '@angular/core';

//módulo para hacer peticiones HTTP y hacer peticiones a servicios REST.
//En el servicio debemos importar HttpClient(para hacer las peticiones al API REST por AJAX) y HttpHeaders(para establecer cabeceras en las peticiones):
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs"; //Permite que la actualizacion de datos sea asincrona, osea inmediata
import { GLOBAL } from "./GLOBAL"; //Importamos el archivo que acabamos de crear, el cual nos conecta a la api
import { User } from "../models/User"; //Importamos nuestro modelo, el cual estructura los datos que vamos a recibir

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url; //variable publica que inicializaremos en el constructor
  public token; //creamos la variables donde se almacenaran los datos del localstorage
  public identity;

  constructor( //Vamos a instanciar el HttpClient
    private _http : HttpClient

  ) { 
    this.url= GLOBAL.url; //esta es la cadena de conexion para nuestro back
  }

  //VAMOS A CREAR LOS METODOS QUE SE CONECTARAN A LA API

  registrar(user):Observable<any>{ // Va a recibir los datos del user como parametro
     var obj={ //Es igual a todos los datos que vamos a ir ingresando en user
      nombre: user.nombre,
      email: user.email,
      password: user.password
     }

     let headers= new HttpHeaders().set('Content-Type', 'application/json'); //Nueva instancia de http, este nos permite manipular los metodos en la url, los cuales recibiran un tipo de contenido Json

     return this._http.post(this.url + 'registrar', obj, {headers: headers})
     //Aqui retornamos por medio del metodo post, la url/registrar junto a los datos ingresados por el usuario que se va a registrar
  }

//Nos va arecibir un usuario y un get token nulo
login(user,gettoken = null):Observable<any>{
  let json = user;
  if(gettoken != null){
    user.gettoken = true;
  }
 
  let headers = new HttpHeaders().set('Content-Type','application/json');
  return this._http.post(this.url+'login',json,{headers:headers});
}

get_users():Observable<any>{
  let headers = new HttpHeaders().set('Content-Type','application/json');
  return this._http.get(this.url+'usuarios/',{headers:headers});
}
//creamos el servicio
get_user(id):Observable<any>{
  let headers = new HttpHeaders().set('Content-Type','application/json');
  return this._http.get(this.url+'usuario/'+id,{headers:headers});
}
get_messages(de, para):Observable<any>{
  let headers = new HttpHeaders().set('Content-Type','application/json');
  return this._http.get(this.url+'message/'+de+'/'+ para,{headers:headers});
}

get_send_msm(msm):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
  return this._http.post(this.url+'message/enviar/', msm,{headers:headers});
}


desactivar(id):Observable<any>{
  let headers = new HttpHeaders().set('Content-Type','application/json');
return this._http.put(this.url+'usuario/desactivar/'+id,{headers:headers});
}
activar(id):Observable<any>{
  let headers = new HttpHeaders().set('Content-Type','application/json');
return this._http.put(this.url+'usuario/activar/'+id,{headers:headers});
}


getToken(){ // Obtener el token del usuario logeado
  let token = localStorage.getItem('token'); //Obtenemos el token que esta guardado en el navegador
  if(token){ //si hay un token en el localstorage que lo guarde en la variable
    this.token = token;
  }else{
    this.token = null; //Sino sera nulo
  }

  return this.token; //nos retorne la informacion
}

getIdentity(){ //obtener los datos del usuario logeado
  let identity = JSON.parse(localStorage.getItem('identity'));
  if(identity){
    this.identity = identity;
  }
  else{
    this.identity = null;
  }

  return this.identity;
}

// CREAMOS LA FUNCION PARA TRAER TODOS LOS USUARIOS DEL CHAT
update_config(data):Observable<any>{
  console.log(data);
  
  const fd = new FormData();
  fd.append('nombre',data.nombre);
  fd.append('telefono',data.telefono);
  fd.append('imagen',data.imagen);
  if(data.password){
    fd.append('password',data.password);
  }
  fd.append('bio',data.bio);
  fd.append('curso',data.curso);
/*   fd.append('notificacion',data.notificacion); */
  fd.append('estado',data.estado);
/*   fd.append('sonido',data.sonido); */

  return this._http.put(this.url+'usuario/editar/'+data._id,fd);
}

}
