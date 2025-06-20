import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ModeloDispositivoRequest } from '../models/modeloDispositivo-request.model';
import { ModeloDispositivoResponse } from '../models/modeloDispositivo-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class ModeloDispositivoService extends CrudService<ModeloDispositivoRequest,ModeloDispositivoResponse> {

  constructor(
      protected http:HttpClient,
    ) { 
      super(http, urlConstants.modelodispositivo);
    }
}
