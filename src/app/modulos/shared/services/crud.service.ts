import { Inject, Injectable } from '@angular/core';
import { CrudInterface } from '../interfaces/crud-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { publishFacade } from '@angular/compiler';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';

@Injectable({
  providedIn: 'root'
})
/**TODO: IMPLEMENTA TODOS LOS METODOS RELACIONADOS AL CRUD
 * 
 * T==>REQUEST
 * Y==>RESPONSE
 * 
 */
export class CrudService<T,Y> implements CrudInterface<T,Y> {

  constructor(
    protected _http: HttpClient,
    @Inject('url_service') public url_service: string
  ) { }

  /**TODO: Obtiene la lista de toda la tabla */
  getAll(): Observable<Y[]> {
    return this._http.get<Y[]>(this.url_service);
    // return this._http.get<CargoResponse[]>(urlConstants.cargo);
  }

  /**TODO: Inserta un registro */
  create(request: T): Observable<Y> {
    return this._http.post<Y>(this.url_service,request);
  }

  /**TODO: Actualiza un registro */
  update(request: T): Observable<Y> {
    return this._http.put<Y>(this.url_service,request);
  }

  /**TODO: Elimina un registro */
  delete(id: number): Observable<number> {
    return this._http.delete<number>(`${this.url_service}${id}`);//interpolacion
  }

  /** Obtiene un registro por su ID */
  getById(id:number):Observable<Y>{
    return this._http.get<Y>(`${this.url_service}${id}`)
  }

    /**TODO: FILTRO GENERICO */
  genericFilter(request:GenericFilterRequest) : Observable<GenericFilterResponse<Y>>
  {
    return this._http.post<GenericFilterResponse<Y>>(`${this.url_service}filter`, request);//interpolacion
  }
} 
