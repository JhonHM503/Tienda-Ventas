import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ClienteRequest } from '../models/cliente-request.model';
import { ClienteResponse } from '../models/cliente-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { VClientePersona } from '../models/VClientePersona.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends CrudService<ClienteRequest,ClienteResponse>{

  constructor(
    protected http:HttpClient,
  ) {
    super(http, urlConstants.cliente);
   }

  buscarDNI(dni:string): Observable<ClienteRequest> {
    return this._http.get<ClienteRequest>(`${urlConstants.cliente}dni/dni/${dni}`);
    // return this._http.get<CargoResponse[]>(urlConstants.cargo);
    
  }
}