import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    // FormsModule,
    // ReactiveFormsModule,
    // HttpClientModule  //sin este no podemos consumier ningun servicio web
    SharedModule
  ]
})
export class AuthModule { }
