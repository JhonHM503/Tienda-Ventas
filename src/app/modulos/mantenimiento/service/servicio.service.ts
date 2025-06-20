import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ServicioRequest } from '../models/servicio-request.model';
import { ServicioResponse } from '../models/servicio-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { VServicioImagen } from '../models/VServicioImagen.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService extends CrudService<ServicioRequest,ServicioResponse> {

  constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.servicio);
  }

}

