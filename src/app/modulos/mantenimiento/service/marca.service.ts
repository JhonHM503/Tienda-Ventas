import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { MarcaRequest } from '../models/marca-request.model';
import { MarcaResponse } from '../models/marca-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class MarcaService extends CrudService<MarcaRequest,MarcaResponse> {
 constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.marca)
  }
}
