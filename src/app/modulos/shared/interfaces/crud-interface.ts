import {Observable} from "rxjs"


export interface CrudInterface<T,Y> {
    // METODOS DEL CRUD
  getAll(): Observable<Y[]>;
  create(request: T):Observable<Y>;
  update(request: T):Observable<Y>;
  delete(id:number):Observable<number>; 

  // Método para obtener un registro por su ID
  getById(id: number): Observable<Y>;
  //getByFilter(request: GenericFilterRequest): Observable<GenericFilterResponse<T>>;
  //createMultiple(request: T[]): Observable<T[]>
  //updateMultiple(request: T[]): Observable<T[]>

}
