import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../../models/User"; //Contectamo el modelo 
import * as io from "socket.io-client";
import { UserService } from "../../services/user.service"; //Importamos nuestro servicio
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user;
  public token;
  public identity;
  public data_user;
  public usuarios: Array<any>;
  public socket = io('http://localhost:4201');
  constructor( 
    private _userService: UserService,
    private _router: Router,  //Llamamos la funcionalidad del router

  ) {
    this.data_user = this._userService.getIdentity(); // obtenemos de la funcion del service sinos habiamos logeado o no
   }

  ngOnInit(): void {
    this.user= new User('', '', '', '', '', '', '', '', false); //Creamos la nueva instancia
    if(this.data_user){ //si me he logeado con anterioridad al volver al index pues siga en el chat y no me devuelva al login
      this._router.navigate(['messenger']);
    }

  }

  onSubmit(loginForm){
    console.log(loginForm.value)

    if(loginForm.valid){ //Se envie lleno el formulario
      this._userService.login(this.user).subscribe( //vamos a mandar a los datos a la api
        response =>{ //vamos hacer un tokent

          console.log(response); //vamos a devolver el response para verlo en consola
          this.token = response.jwt; //guardamos el token que nos arroja la api de ese login
          this.identity= JSON.stringify(response.user); //cada vez que nos logiemos vamos a recibir el token y la identidad del usuario
          
          localStorage.setItem('token',this.token); //vamos a guardarlo en el localstorage

          this._userService.login(this.user,true).subscribe(
            response =>{ //el login form este correctamente llenado
              localStorage.setItem('identity', this.identity); //guardamos en el localstorage la identidad
              this._userService.activar(response.user._id).subscribe(
                response=>{
                  this._userService.get_users().subscribe(
                    response =>{
                     this.usuarios = response.users;
                     this.socket.emit('save-users',this.usuarios);
                    
                      
                    },
                    error =>{
            
                    }
                  );
                },
                error=>{

                }
              
              )
              this._router.navigate(['messenger']);
            },
            error=>{

            }
            
          );
        },
        error=>{

        }
        
      );

    } else {

      
    }
  }
}
