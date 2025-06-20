import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { UsuarioRequest } from '../models/usuario-request.model';
import { UsuarioResponse } from '../models/usuario-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { VUsuarioPersonaRol } from '../models/VUsuarioPersonaRol.model';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { PersonaRequest } from '../models/persona-request.model';
import { PersonaService } from './persona.service';
import { PersonaResponse } from '../models/persona-response.model';
import { VPersona } from '../models/VPersona.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends CrudService<UsuarioRequest,UsuarioResponse> {

  constructor(
    protected http:HttpClient,
    private personaService: PersonaService
  ) {
    super(http, urlConstants.usuario);
   }

   createPersonaAndUsuario(personaRequest: PersonaRequest, usuarioRequest: UsuarioRequest): Observable<UsuarioResponse>
   {
      return this.personaService.create(personaRequest).pipe(
        switchMap((personaResponse: PersonaResponse)=>{
            usuarioRequest.idPersona =  personaResponse.idPersona;
            return this.create(usuarioRequest);
        })
      );
   }

    updatePersonaAndUsuario(personaRequest: PersonaRequest, usuarioRequest: UsuarioRequest): Observable<[PersonaResponse, UsuarioResponse]> {
    return forkJoin([
      this.personaService.update(personaRequest),
      this.update(usuarioRequest)
    ]);
    }

    genericFilterView(request: GenericFilterRequest): Observable<GenericFilterResponse<VPersona>> {
    return this._http.post<GenericFilterResponse<VPersona>>(`${urlConstants.persona}filter-view`, request);
  }
}

