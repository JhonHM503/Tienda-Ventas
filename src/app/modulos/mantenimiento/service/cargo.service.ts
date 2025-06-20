import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlConstants } from 'src/app/constans/url.constans';
import { CargoResponse } from '../models/cargo-response.model';
import { CargoRequest } from '../models/cargo-request.model';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CargoService extends CrudService<CargoRequest,CargoResponse> {

  constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.cargo);
  }


  // METODOS DEL CRUD
  /*
    constructor(
    private _http:HttpClient
  ) { }

  getAll(): Observable<CargoResponse[]>
  {
    // let auth_token=sessionStorage.getItem("token");
    // const jwtHeaders = new HttpHeaders({
    //   'Content-Type ': 'application/json',
    //   'Authorization': `Bearer ${auth_token}`
    // });

    // return this._http.get<CargoResponse[]>(urlConstants.cargo,{headers:jwtHeaders});
    return this._http.get<CargoResponse[]>(urlConstants.cargo);
  }

  create(request:CargoRequest):Observable<CargoResponse>{
    
    return this._http.post<CargoResponse>(urlConstants.cargo,request);
  }

  update(request:CargoRequest):Observable<CargoResponse>{

    return this._http.put<CargoResponse>(urlConstants.cargo,request);
  }

  delete(id:number):Observable<number>
  {
    return this._http.delete<number>(`${urlConstants.cargo}${id}`);//interpolacion
  }
  */
  // mapear los request response
}
