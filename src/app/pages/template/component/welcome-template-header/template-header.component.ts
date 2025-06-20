import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthStateService } from 'src/app/modulos/auth/service/AuthStateService.service';
import { CarritoService } from 'src/app/modulos/ventas/service/carrito.service';
import { SearchService } from 'src/app/modulos/ventas/service/search.service';

@Component({
  selector: 'app-template-header',
  templateUrl: './template-header.component.html',
  styleUrls: ['./template-header.component.scss']
})
export class TemplateHeaderComponent implements OnInit {
  isLoggedIn$ = this.authStateService.isLoggedIn$;
  username$ = this.authStateService.username$;
  numeroProductos$: Observable<number>=this.carritoService.getNumeroProductos();
  searchTerm: string = '';

  constructor(
    private authStateService: AuthStateService,
    private carritoService: CarritoService,
     private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.searchService.updateSearchTerm(this.searchTerm);
    
    // Si no estamos en la página de productos, navegamos a ella
    // if (!this.router.url.includes('/ventas')) {
    //   this.router.navigate(['/ventas']);
    // }
  }

  logout() {
    this.authStateService.logout();
    this.router.navigate(['/']);
  }
}