import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  private username = new BehaviorSubject<string>('');
  private userId = new BehaviorSubject<number | null>(null);
  
  isLoggedIn$ = this.isLoggedIn.asObservable();
  username$ = this.username.asObservable();
  userId$ = this.userId.asObservable();
  
  constructor() {
      this.checkInitialAuthState();
   }

  private checkInitialAuthState() {
    const token = sessionStorage.getItem('token');
    const storedUsername = sessionStorage.getItem('username');
    const storedUserId = sessionStorage.getItem('idUsuario');

    // Solo considera autenticado si hay token Y datos de usuario
    if (token && storedUsername && storedUserId) {
      this.setLoggedIn(true);
      this.setUsername(storedUsername);
      this.setUserId(Number(storedUserId));
    } else {
      // Si falta algún dato, limpiar todo
      this.logout();
    }
  }

  setLoggedIn(value: boolean) {
    this.isLoggedIn.next(value);
  }

  setUsername(name: string) {
    this.username.next(name);
    sessionStorage.setItem('username', name);
  }

  setUserId(id: number) {
    this.userId.next(id);
    sessionStorage.setItem('idUsuario', id.toString());
  }

  logout() {
    sessionStorage.clear();
    this.setLoggedIn(false);
    this.setUsername('');
    this.setUserId(0);
  }

  getUserId(): number | null {
    return this.userId.getValue();
  }
}
