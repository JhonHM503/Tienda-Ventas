import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from 'src/app/models/login-response.model';
import { urlConstants } from 'src/app/constans/url.constans';
import { RegisterRequest } from '../models/register-request';
import { RegisterResponse } from '../models/register-response';
import { AuthStateService } from './AuthStateService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http:HttpClient,
    private authStateService: AuthStateService
  ) { }


  login(request:LoginRequest):Observable<LoginResponse>
  {

    return this.http.post<LoginResponse>(urlConstants.auth,request).pipe(
      tap(response =>{
         if (response.success) {  // Asumiendo que tu respuesta tiene un campo 'success'
          this.authStateService.setLoggedIn(true);
          this.authStateService.setUsername(response.usuario.username);
          this.authStateService.setUserId(response.usuario.idUsuario);
        }
      })
    );

  };

  register(request:RegisterRequest):Observable<RegisterResponse>
  {
    return this.http.post<RegisterResponse>(`${urlConstants.auth}register`,request).pipe(
      tap(response => {
        console.log('AuthService register tap:', response); // Para debug
        if (response.success) {
          // Guardar el token en sessionStorage
          this.authStateService.setLoggedIn(true);
          this.authStateService.setUsername(response.usuario.username);
          this.authStateService.setUserId(response.usuario.idUsuario);
        }
      })
    )
  }
}
