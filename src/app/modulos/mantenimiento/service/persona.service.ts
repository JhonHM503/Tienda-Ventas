import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { PersonaRequest } from '../models/persona-request.model';
import { PersonaResponse } from '../models/persona-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';
import { Observable } from 'rxjs';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { VPersona } from '../models/VPersona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends CrudService<PersonaRequest,PersonaResponse> {

  constructor(
    protected http:HttpClient,
  ) {
    super(http,urlConstants.persona);
   }

  buscarDNI(dni:string): Observable<PersonaRequest> {
    return this._http.get<PersonaResponse>(`${urlConstants.persona}dni/dni/${dni}`);
    // return this._http.get<CargoResponse[]>(urlConstants.cargo);
    
  }
  
  genericFilterView(request: GenericFilterRequest): Observable<GenericFilterResponse<VPersona>> {
    return this._http.post<GenericFilterResponse<VPersona>>(`${urlConstants.persona}filter-view`, request);
  }
}
