import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from "../../services/GLOBAL"; //IMPORTAMOS LA URL
import { Message } from "../../models/Message";
import * as io from "socket.io-client";
import { Router } from '@angular/router';
import Push from 'push.js';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef;

  public data_msm;
  public send_message;
  public usuarios: Array<any>;
  public url;
  public user_select; // se guardara el usuario que estamos consultando
  public mensajes;
  public identity; //usuario logeado
  public token;
  public de;
  public para;
  public socket = io('http://localhost:4201');
  constructor(
    private _userService: UserService,
    private _router: Router,
  ) {

    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity(); //llamamos la funcion del servicio
    this.token = this._userService.getToken();
    this.de = this.identity._id;
  }

  ngOnInit() {
    if (this.identity) {

      this.data_msm = new Message('', '', '', '');

      this._userService.get_users().subscribe(
        response => {
          console.log(response) //me mmuestra en consola todos los usuarios que tengo registrados
          this.usuarios = response['users'];
        },
        error => {

        }
      );

      this.socket.on('new-message', function (data) {
        var data_all = {
          de: data.message.de,
          para: data.message.para,
          msm: data.message.msm,
          createAt: data.message.createAt,
        }

        this._userService.get_user(data.message.de).subscribe(
          response => {
            if (response.user._id != this.de) {
              Push.create(response.user.nombre, {
                body: data.message.msm,
                icon: this.url+'usuario/img/'+response.user.imagen,
                timeout: 4000,
                onClick: function () {
                  window.focus();
                  this.close();
                }
              });
              (document.getElementById('player') as any).load();
              (document.getElementById('player') as any).play();
            }
          },
          error => {

          }
        )

        this.mensajes.push(data_all);

      }.bind(this));

      this.socket.on('new-users', function (data) {
        this.usuarios = data.users;
      }.bind(this));

    } else {
      this._router.navigate(['']);
    }
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngDoCheck(){
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();

  }

  listar(id) {
    this._userService.get_user(id).subscribe(
      response => {
        console.log(response)
        this.user_select = response.user;
        console.log(this.user_select)
        //usuario logiado como primer parametro
        this._userService.get_messages(this.de, id).subscribe(
          response => {
            console.log(response);
            this.mensajes = response.messages;

          },
          error => {

          }

        );


      },
      error => {

      }
    )
  }

  onSubmit(msmForm) {
    if (msmForm.valid) {
      this.send_message = {
        de: this.de,
        para: this.user_select._id,
        msm: this.data_msm.msm,
      };
      this._userService.get_send_msm(this.send_message).subscribe(
        response => {
          //SEND MESSAGE
          this.data_msm.msm = '';
          this.socket.emit('save-message', response.message);
          this.scrollToBottom();




        },
        error => {
        }
      )

    } else {

    }
  }
  logout() {
    this._userService.desactivar(this.de).subscribe(
      response => {
        this._userService.get_users().subscribe(
          response => {
            this.usuarios = response.users;
            this.socket.emit('save-users', this.usuarios);


          },
          error => {

          }
        );
      },
      error => {

      }
    );
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this.token = '';
    this.identity = '';



    this._router.navigate(['']); //vamos a enviar al usuario que se deslogea al login
  }
}
