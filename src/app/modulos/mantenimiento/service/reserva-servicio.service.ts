import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ReservaServicioRequest } from '../models/reservaServicio-request.model';
import { ReservaServicioResponse } from '../models/reservaServicio-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class ReservaServicioService extends CrudService<ReservaServicioRequest,ReservaServicioResponse> {

  constructor(
    protected http:HttpClient,
  ) {
    super(http,urlConstants.reservaservicio);
   }
}
