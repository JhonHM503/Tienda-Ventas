import { Injectable } from '@angular/core';
import { urlConstants } from 'src/app/constans/url.constans';
import { CrudService } from '../../shared/services/crud.service';
import { MetodoPagoRequest } from '../models/metodoPago-request.model';
import { MetodoPagoResponse } from '../models/metodoPago-response.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService extends CrudService<MetodoPagoRequest,MetodoPagoResponse> {

   constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.metodopago);
  }
}
