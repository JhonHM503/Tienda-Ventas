import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { CategoriaRequest } from '../models/categoria-request.model';
import { CategoriaResponse } from '../models/categoria-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends CrudService<CategoriaRequest,CategoriaResponse> {

  constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.categoria);
  }
}
