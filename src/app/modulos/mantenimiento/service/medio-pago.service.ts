import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { MedioPagoRequest } from '../models/medioPago-request.model';
import { MedioPagoResponse } from '../models/medioPago-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class MedioPagoService extends CrudService<MedioPagoRequest,MedioPagoResponse> {

  constructor(
    protected http:HttpClient,
  ) {
    super(http,urlConstants.mediopago);
   }
}
