import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms"; //Especial para utilizar los modulos
import { HttpClientModule } from "@angular/common/http"; //Nos ayuda a traer los datos desde del form


import { AppRoutingModule } from './app-routing.module'; //Importamos el enrutador
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { appRoutingProviders, routing } from './app.routing';
import { MessengerComponent } from './components/messenger/messenger.component';
import { PerfilComponent } from './components/perfil/perfil.component'; //Importamos el el routing que creamos

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    MessengerComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, //Lo agregamos a imports
    routing, //Tambien lo importamos aqui
    FormsModule, //igualmente los otros
    HttpClientModule //y este
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
