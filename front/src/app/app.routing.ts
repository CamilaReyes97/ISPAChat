import { Routes, RouterModule} from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { MessengerComponent } from './components/messenger/messenger.component'; // Este se autocompleta solo
import {PerfilComponent } from './components/perfil/perfil.component'; // Este se autocompleta solo


const appRouter: Routes = [//Va a contener todas nuestras rutas
    //Va a tener el componente a cargo
    { path: 'registro', component: RegistroComponent }, //Le damos enter y me lo importa automaticamente arriba
    { path: '', component: LoginComponent }, //La ruta la dejamos vacia porque es la inicial
    {path: 'messenger', component: MessengerComponent}, //Linkeamos el nuevo componente
    {path: 'perfil', component: PerfilComponent}
]

// Exportamos para utilizar en enrutado, va a ser un array que inicia vacio
export const appRoutingProviders: any[]= [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRouter);   //Me permite proveer mi aplicacion desde cualquier lado