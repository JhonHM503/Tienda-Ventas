import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { TipoDocumentoRequest } from '../models/tipoDocumento-request.model';
import { TipoDocumentoResponse } from '../models/tipoDocumento-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService extends CrudService<TipoDocumentoRequest,TipoDocumentoResponse> {

  constructor(
    protected http:HttpClient,
  ) {
    super(http, urlConstants.tipodocumento);
   }
}

