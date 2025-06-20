import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { TipoDispositivoRequest } from '../models/tipoDispositivo-request.model';
import { TipoDispositivoResponse } from '../models/tipoDispositivo-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class TipoDispositivoService extends CrudService<TipoDispositivoRequest,TipoDispositivoResponse> {

constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.tipodispositivo);
  }
}
