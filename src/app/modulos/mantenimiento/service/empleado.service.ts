import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { EmpleadoRequest } from '../models/empleado-request.model';
import { EmpleadoResponse } from '../models/empleado-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { ViewEmpleadoPersona } from '../models/VEmpleadoPersona.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService extends CrudService<EmpleadoRequest,EmpleadoResponse> {

  constructor(
    protected http:HttpClient,
  ) {
    super(http,urlConstants.empleado);
   }

  genericFilterView(request: GenericFilterRequest): Observable<GenericFilterResponse<ViewEmpleadoPersona>> {
    return this._http.post<GenericFilterResponse<ViewEmpleadoPersona>>(`${urlConstants.empleado}filter-view`, request);
  }
}

