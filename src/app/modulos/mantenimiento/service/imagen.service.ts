import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ClienteRequest } from '../models/cliente-request.model';
import { ClienteResponse } from '../models/cliente-response.model';
import { HttpClient } from '@angular/common/http';
import { urlConstants } from 'src/app/constans/url.constans';
import { ImagenRequest } from '../models/imagen-request.model';
import { ImagenResponse } from '../models/imagen-response.model';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService extends CrudService<ImagenRequest,ImagenResponse> {

   private imgbbApiKey = 'e3792ad56fae1f05012ac7d49dc50e36'; // Tu API key de ImgBB
  private imgbbApiUrl = 'https://api.imgbb.com/1/upload';
  
  constructor(
    protected http:HttpClient,
  ) { 
    super(http, urlConstants.imagen);
  }

uploadToImgBB(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(`${this.imgbbApiUrl}?key=${this.imgbbApiKey}`, formData).pipe(
      map((response: any) => {
        if (response.data && response.data.url) {
          return response.data.url;
        }
        throw new Error('No se pudo obtener la URL de la imagen');
      })
    );
  }

  createImageFromImgBB(file: File): Observable<ImagenResponse> {
    return this.uploadToImgBB(file).pipe(
      switchMap((url: string) => {
        const imagenRequest: ImagenRequest = { url };
        return this.create(imagenRequest);
      })
    );
  }
}
