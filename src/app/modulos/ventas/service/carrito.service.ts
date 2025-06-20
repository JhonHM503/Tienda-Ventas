import { Injectable } from '@angular/core';
import { CarritoItem } from '../models/carrito-response.model';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private itemsSubject = new BehaviorSubject<CarritoItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  constructor() { }

  agregarAlCarrito(producto: CarritoItem) {
    const items = this.itemsSubject.value;
    const itemExistente = items.find(item => item.productoId === producto.productoId);

    if (itemExistente) {
      itemExistente.cantidad = Math.min(itemExistente.cantidad + producto.cantidad, 20);
    } else {
      items.push(producto);
    }
    this.itemsSubject.next(items);
    this.actualizarTotal();
  }

  private actualizarTotal() {
    const total = this.calcularTotal();
    this.totalSubject.next(total);
  }

  aumentarCantidad(productoId: number) {
    const items = this.itemsSubject.value;
    const item = items.find(item => item.productoId === productoId);
    if (item && item.cantidad < 20) {
      item.cantidad++;
      this.itemsSubject.next(items);
      this.actualizarTotal();
    }
  }

  disminuirCantidad(productoId: number) {
    const items = this.itemsSubject.value;
    const item = items.find(item => item.productoId === productoId);
    if (item && item.cantidad > 1) {
      item.cantidad--;
      this.itemsSubject.next(items);
      this.actualizarTotal();
    }
  }

  obtenerItems(): CarritoItem[] {
    return this.itemsSubject.value;
  }

  eliminarDelCarrito(productoId: number) {
    const items = this.itemsSubject.value.filter(item => item.productoId !== productoId);
    this.itemsSubject.next(items);
    this.actualizarTotal();
  }

  vaciarCarrito() {
    this.itemsSubject.next([]);
    this.actualizarTotal();
  }

  calcularTotal(): number {
    return this.itemsSubject.value.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  // Método nuevo para obtener el número total de productos
  getNumeroProductos(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.cantidad, 0))
    );
  }
}
