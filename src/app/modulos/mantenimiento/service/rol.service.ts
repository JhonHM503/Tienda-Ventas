import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { RolRequest } from '../models/rol-request.model';
import { RolResponse } from '../models/rol-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class RolService extends CrudService<RolRequest,RolResponse>{

  constructor(
    protected http:HttpClient,
  ) {
    super(http,urlConstants.rol);
   }
}


