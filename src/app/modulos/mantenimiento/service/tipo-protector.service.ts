import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { TipoProtectorRequest } from '../models/tipoProtector-request.model';
import { TipoProtectorResponse } from '../models/tipoProtector-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class TipoProtectorService extends CrudService<TipoProtectorRequest,TipoProtectorResponse> {

constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.tipoprotector);
  }}
