import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgbbService {

 private apiKey = 'e3792ad56fae1f05012ac7d49dc50e36'; // Reemplaza con tu API key de ImgBB
  private apiUrl = 'https://api.imgbb.com/1/upload';

  constructor(private http: HttpClient) { }

  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post(`${this.apiUrl}?key=${this.apiKey}`, formData);
  }
}
