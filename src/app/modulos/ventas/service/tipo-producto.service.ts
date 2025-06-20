import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstants } from 'src/app/constans/url.constans';
import { CrudService } from '../../shared/services/crud.service';
import { TipoProductoRequest } from '../models/tipoProducto-request.model';
import { TipoProductoResponse } from '../models/tipoProducto-response.model';

@Injectable({
  providedIn: 'root'
})
export class TipoProductoService extends CrudService<TipoProductoRequest, TipoProductoResponse> {

  constructor(
        protected http:HttpClient,
      ) { 
        super(http, urlConstants.tipoProducto);
      }
  }
