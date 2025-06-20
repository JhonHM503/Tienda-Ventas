import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../../auth/models/login-request.model';
import { Observable } from 'rxjs';
import { LoginResponse } from 'src/app/models/login-response.model';
import { urlConstants } from 'src/app/constans/url.constans';
import { RegisterRequest } from '../../auth/models/register-request';
import { RegisterResponse } from '../../auth/models/register-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http:HttpClient
  ) { }


  login(request:LoginRequest):Observable<LoginResponse>
  {

    return this.http.post<LoginResponse>(urlConstants.auth,request);

  }

  register(request:RegisterRequest):Observable<RegisterResponse>
  {
    return this.http.post<RegisterResponse>(`${urlConstants.auth}register`,request)
  }
}
