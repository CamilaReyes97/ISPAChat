import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../../models/User"; //Importamos nuestro modelo user, la estructura de neustros datos
import { UserService } from "../../services/user.service"; //Traemos el servicio
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public user; //Creamos una variable publica
  constructor(
    private _userService: UserService,  //Esta
    private _router: Router //Vamos a re direccionar cuando me registre
  ) { }

  ngOnInit(): void {

    //Hacemos una intancia nueva de nuestro modelo de dato y Por la cantidad de datos que tenemos ''
    //Esta instancia de nuestro modelo va a recibir los datos del servicio
    this.user = new User('', '', '', '', '', '', '', '', false);
  }

  onSubmit(registroForm) {//Creamos el evento onSubmit que envia el formulario y llamamos el nombre del formulario
    console.log(registroForm.value) //Nos mostrara los datos ingresado en el formulario a traves de un click

    //llamamos la funcion registrar que nos permite usar la api
    this._userService.registrar({
      nombre: registroForm.value.nombre,
      email: registroForm.value.email,
      password: registroForm.value.password
    }).subscribe( //Nos vamos a suscribir al servicio y esto recibira una respuesta o un error
      response => {
        this._router.navigate(['']); //Me va a redireccionar a la pagina de inicio una vez me registre correctamente 
      },
      error => {

      }
    )

  }

}
