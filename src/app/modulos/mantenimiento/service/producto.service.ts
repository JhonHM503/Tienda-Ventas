import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstants } from 'src/app/constans/url.constans';
import { CrudService } from '../../shared/services/crud.service';
import { ProductoRequest } from '../models/producto-request.model';
import { ProductoResponse } from '../models/producto-response.model';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { VProducto } from '../models/VProductos.model';
import { ImagenService } from './imagen.service';
import { ImagenRequest } from '../models/imagen-request.model';
import { ImagenResponse } from '../models/imagen-response.model';
import { ProductoDispositivoService } from './producto-dispositivo.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends CrudService<ProductoRequest,ProductoResponse> {

  constructor(
    protected http:HttpClient,
    protected imagenService:ImagenService,
    protected productoDispositivo:ProductoDispositivoService
  ) { 
    super(http, urlConstants.producto);
  }

   createProductoAndImagen(imagenRequest: ImagenRequest, productoRequest: ProductoRequest): Observable<ProductoResponse>
   {
      return this.imagenService.create(imagenRequest).pipe(
        switchMap((imagenResponse: ImagenResponse)=>{
            productoRequest.idImagen =  imagenResponse.idImagen;
            return this.create(productoRequest);
        })
      );
   }

    updateProductoAndImagen(imagenRequest: ImagenRequest, productoRequest: ProductoRequest): Observable<[ImagenResponse, ProductoResponse]> {
    return forkJoin([
      this.imagenService.update(imagenRequest),
      this.update(productoRequest)
    ]);
  }
  
  generericFilterView(request: GenericFilterRequest):Observable<GenericFilterResponse<VProducto>> {
    return this._http.post<GenericFilterResponse<VProducto>>(`${urlConstants.producto}filter-view`, request);
  }
}
