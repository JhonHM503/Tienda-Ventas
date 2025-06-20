import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstants } from 'src/app/constans/url.constans';
import { CrudService } from '../../shared/services/crud.service';
import { VentaRequest } from '../models/venta-request.model';
import { VentaResponse } from '../models/venta-response.model';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVentaRequest } from '../models/datalleVenta-request.model';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { DetalleVentaResponse } from '../models/datalleVenta-response.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService extends CrudService<VentaRequest,VentaResponse> {

  constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.venta);
  }

   // Nuevo método para obtener las ventas del usuario actual
 getVentasUsuario(idUsuario: number): Observable<VentaResponse[]> {
    return this.getAll().pipe(
      map(ventas => ventas.filter(venta => venta.idUsuario === idUsuario))
    );
  }
}
