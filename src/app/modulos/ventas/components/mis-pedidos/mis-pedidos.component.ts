import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthStateService } from 'src/app/modulos/auth/service/AuthStateService.service';
import { DetalleVentaResponse } from 'src/app/modulos/mantenimiento/models/datalleVenta-response.model';
import { VentaResponse } from 'src/app/modulos/mantenimiento/models/venta-response.model';
import { DetalleVentaService } from 'src/app/modulos/mantenimiento/service/detalle-venta.service';
import { VentaService } from 'src/app/modulos/mantenimiento/service/venta.service';
import { ProductoService } from 'src/app/modulos/mantenimiento/service/producto.service';
import { ProductoResponse } from 'src/app/modulos/mantenimiento/models/producto-response.model';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.scss'
})
export class MisPedidosComponent implements OnInit {

  ventas: VentaResponse[] = [];
  cargando = true;
  error = '';
  detallesVenta: { [key: number]: DetalleVentaResponse[] } = {};
  cargandoDetalles = false;
  detallesVisibles: { [key: number]: boolean } = {}; // Nueva propiedad
  productos: { [key: number]: ProductoResponse } = {};
  

  constructor(
    private ventaService: VentaService,
    private detalleVentaService: DetalleVentaService,
    private authStateService: AuthStateService,
    private productoService: ProductoService,
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarVentas();
  }

  cargarVentas() {
    this.authStateService.userId$.subscribe(userId => {
      if (userId) {
        this.ventaService.getVentasUsuario(userId).subscribe({
          next: (data) => {
            this.ventas = data;
            this.cargando = false;
          },
          error: (err) => {
            this.error = 'Error al cargar las ventas';
            this.cargando = false;
          }
        });
      } else {
        this.error = 'Usuario no autenticado';
        this.cargando = false;
      }
    });
  }

  cargarProductos() {
    this.productoService.getAll().subscribe({
      next: (productos) => {
        productos.forEach(producto => {
          this.productos[producto.idProducto] = producto;
        });
      },
      error: (err) => {
        console.error('Error al cargar los productos', err);
      }
    });
  }

  toggleDetallesVenta(idVenta: number) {
    if (this.detallesVisibles[idVenta]) {
      // Si los detalles están visibles, los ocultamos
      this.detallesVisibles[idVenta] = false;
    } else {
      // Si los detalles no están visibles, los cargamos y mostramos
      this.cargandoDetalles = true;
      if (!this.detallesVenta[idVenta]) {
        this.detalleVentaService.getAll().subscribe({
          next: (data) => {
            this.detallesVenta[idVenta] = data.filter(detalle => detalle.idVenta === idVenta);
            this.detallesVisibles[idVenta] = true;
            this.cargandoDetalles = false;
          },
          error: (err) => {
            console.error('Error al cargar los detalles de la venta', err);
            this.cargandoDetalles = false;
          }
        });
      } else {
        // Si ya tenemos los detalles, solo los mostramos
        this.detallesVisibles[idVenta] = true;
        this.cargandoDetalles = false;
      }
    }
  }

   getNombreProducto(idProducto: number): string {
    return this.productos[idProducto]?.nombre || `Producto ID: ${idProducto}`;
  }
}