import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ProductoDispositivoRequest } from '../models/productoDispositivo-request.model';
import { ProductoDispositivoResponse } from '../models/productoDispositivo-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class ProductoDispositivoService extends CrudService<ProductoDispositivoRequest,ProductoDispositivoResponse> {

  constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.productodispositivo)
  }
}
