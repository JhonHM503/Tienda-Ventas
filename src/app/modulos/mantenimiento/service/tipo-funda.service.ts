import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { TipoFundaRequest } from '../models/tipoFunda-request.model';
import { TipoFundaResponse } from '../models/tipoFunda-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class TipoFundaService extends CrudService<TipoFundaRequest,TipoFundaResponse> {

constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.tipofunda);
  }}
