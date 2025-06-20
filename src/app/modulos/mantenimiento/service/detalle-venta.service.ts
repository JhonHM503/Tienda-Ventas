import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { DetalleVentaRequest } from '../models/datalleVenta-request.model';
import { DetalleVentaResponse } from '../models/datalleVenta-response.model';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService extends CrudService<DetalleVentaRequest,DetalleVentaResponse> {

  constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.detalleventa);
  }
}
