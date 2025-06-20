import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ReservaRequest } from '../models/reserva-request.model';
import { ReservaResponse } from '../models/reserva-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { ViewReservaUsuario } from '../models/ViewReservaUsuario.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReservaService extends CrudService<ReservaRequest,ReservaResponse> {

  constructor(
    protected http:HttpClient,
  ) {
    super(http, urlConstants.reserva);
   }

  genericFilterView(request: GenericFilterRequest): Observable<GenericFilterResponse<ViewReservaUsuario>> {
    return this._http.post<GenericFilterResponse<ViewReservaUsuario>>(`${urlConstants.reserva}filter-view`, request);
  }

}
