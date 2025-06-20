import { Component, OnDestroy, OnInit } from '@angular/core';
import { CarritoItem } from '../../models/carrito-response.model';
import { CarritoService } from '../../service/carrito.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/modulos/auth/service/AuthStateService.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit, OnDestroy{
  
  itemsCarrito: CarritoItem[] = [];
  total: number = 0;
  isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private _carritoService: CarritoService,
     private authStateService: AuthStateService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this._carritoService.items$.subscribe(items => {
        this.itemsCarrito = items;
      })
    );

    this.subscription.add(
      this._carritoService.total$.subscribe(total => {
        this.total = total;
      })
    );

    this.subscription.add(
      this.authStateService.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  aumentarCantidad(productoId: number) {
    this._carritoService.aumentarCantidad(productoId);
  }

  disminuirCantidad(productoId: number) {
    this._carritoService.disminuirCantidad(productoId);
  }

  eliminarDelCarrito(productoId: number) {
    this._carritoService.eliminarDelCarrito(productoId);
  }

  vaciarCarrito() {
    this._carritoService.vaciarCarrito();
  }

  irADetalleCompra() {
  if (this.isLoggedIn) {
      this._router.navigate(['detalle-compra']);
    } else {
      if (confirm('Para realizar una compra, primero debes iniciar sesión. ¿Deseas ir a la página de inicio de sesión?')) {
        this._router.navigate(['/auth/login']);
      }};
  }
}
