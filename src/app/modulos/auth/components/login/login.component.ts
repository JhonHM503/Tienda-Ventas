import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from 'src/app/services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { AuthService } from '../../service/auth.service';
import { Subscriber } from 'rxjs';
import { LoginResponse } from 'src/app/models/login-response.model';
import { Route, Router } from '@angular/router';
import { AuthStateService } from '../../service/AuthStateService.service';
import { alert_login_error, alert_login_success } from 'src/app/functions/general.functions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  loginForm:FormGroup;
  loginRequest:LoginRequest=new LoginRequest();

  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private _router:Router,
    private authStateService: AuthStateService
  )
  {
    this.loginForm=this.fb.group({
      username:[null,[Validators.required]],
      password:[null,[Validators.required]],
      email:[null,[Validators.required, Validators.email]],
    })
  }

  username:string = "";
  password:string = "";
  email: string = "";

  login(){

    console.log(this.loginForm.getRawValue());
    this.loginRequest=this.loginForm.getRawValue();

    this.authService.login(this.loginRequest).subscribe({
      next:(data:LoginResponse)=>{
        console.log(data);
        //redirigir al dashboard
        // this._router.navigate(['dashboard'])
        
        //ALMACENAMOS EL VALOR DEL TOKEN Y ALGUNOS VALORES DE USUARIO
        
        //PARA SESION STORAGE
        if(data.success){
          alert_login_success("Inicio de sesión correcto",'!BIENVENIDO¡')
          
          sessionStorage.setItem("token",data.token);
          sessionStorage.setItem("idUsuario",data.usuario.idUsuario.toString());
          sessionStorage.setItem("username",data.usuario.username);
          sessionStorage.setItem("fullName",data.persona.nombre)
          sessionStorage.setItem("rolId",data.rol.idRol.toString())
          sessionStorage.setItem("NombreRol",data.rol.nombre);

          this.authStateService.setLoggedIn(true);
          this.authStateService.setUsername(data.usuario.username);

          this.redirigirSegunRol(data.rol.idRol);
        }
        else{
          alert_login_error(
                    'Inicio de sesión fallido',
                    'Credenciales incorrectas'
                );
        }
      },
      error:(err)=>{
        console.error("Error durante el inicio de sesión:", err);
        alert_login_error(
                    'Inicio de sesión fallido',
                    'Credenciales incorrectas'
                );
      },
      complete:()=>{},
    });
  }

  private redirigirSegunRol(idRol: number) {
    if (idRol === 3) { // Rol de cliente
      this._router.navigate(['/welcome-template']);
    } else {
      this._router.navigate(['/dashboard/ventas/general-ventas']);
    }
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
