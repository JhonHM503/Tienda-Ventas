import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CarritoItem } from '../../models/carrito-response.model';
import { CarritoService } from '../../service/carrito.service';
import { CommonModule } from '@angular/common';
import { VentaService } from 'src/app/modulos/mantenimiento/service/venta.service';
import { Router } from '@angular/router';
import { VentaRequest } from 'src/app/modulos/mantenimiento/models/venta-request.model';
import { DetalleVentaRequest } from 'src/app/modulos/mantenimiento/models/datalleVenta-request.model';
import { forkJoin } from 'rxjs';
import { DetalleVentaService } from 'src/app/modulos/mantenimiento/service/detalle-venta.service';
import { AuthStateService } from 'src/app/modulos/auth/service/AuthStateService.service';

declare var paypal:any;

@Component({
  selector: 'app-detalle-compra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-compra.component.html',
  styleUrl: './detalle-compra.component.scss'
})
export class DetalleCompraComponent implements OnInit,AfterViewInit {
  // itemsCompra: CarritoItem[] = [];
  // total: number = 0;

  // constructor(private _carritoService: CarritoService) {}

  // ngOnInit(): void {
  //   this._carritoService.items$.subscribe(items => {
  //     this.itemsCompra = items;
  //   });

  //   this._carritoService.total$.subscribe(total => {
  //     this.total = total;
  //   });
  // }

  // confirmarCompra() {
  //   // Aquí puedes implementar la lógica para confirmar la compra
  //   console.log('Compra confirmada');
  //   // Después de confirmar, podrías vaciar el carrito
  //   this._carritoService.vaciarCarrito();
  // }
  itemsCarrito: any[] = [];
  total: number = 0;

  mensajeExito: string = '';
  mostrarMensaje: boolean = false;

  constructor(
    private _carritoService: CarritoService,
    private _ventaService: VentaService,
    private _detalleVentaService: DetalleVentaService,
    private authStateService: AuthStateService,
    private router: Router,
  ){}


  ngOnInit(): void {
     this.itemsCarrito = this._carritoService.obtenerItems();
    this.total = this._carritoService.calcularTotal();
  }

  ngAfterViewInit(): void {
    this.inicializarBotonPayPal();
  }

private obtenerFechaActual(): string {
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset();
    const fechaLocal = new Date(ahora.getTime() - (offset*60*1000));
    return fechaLocal.toISOString().split('T')[0];
  }

  inicializarBotonPayPal(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.total.toString(),
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((detalles: any) => {
          this.procesarCompra(detalles);
        });
      }
    }).render('#contenedor-boton-paypal');
  }

  procesarCompra(detallePago:any): void {

    const userId = this.authStateService.getUserId();
    if (!userId) {
      console.error('Usuario no autenticado');
      this.router.navigate(['/login']);  // Redirige al login si no hay usuario
      return;
    }

    const solicitudVenta: VentaRequest = {
      idVenta: 0, // Esto será asignado por el backend
      idUsuario: userId, // Reemplazar con el ID de usuario real
      idMetodoPago: 4, // Reemplazar con el ID del método de pago real
      fechaVenta: this.obtenerFechaActual(),
      total: this.total,
      estadoVenta:false
    };

    this._ventaService.create(solicitudVenta).subscribe(
      (respuestaVenta) => {
        console.log('Venta creada:', respuestaVenta);
        
        const detallesVenta: DetalleVentaRequest[] = this.itemsCarrito.map(item => ({
          idDetalleVenta: 0, // Esto será asignado por el backend
          idVenta: respuestaVenta.idVenta,
          idProducto: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.precio * item.cantidad
        }));
        
        // Usar forkJoin para crear múltiples detalles de venta en paralelo
        forkJoin(detallesVenta.map(detalle => this._detalleVentaService.create(detalle)))
        .subscribe(
          (respuestasDetalles) => {
              console.log('Detalles de venta creados:', respuestasDetalles);
              this._carritoService.vaciarCarrito();
              this.mostrarMensajeExito();
              // this.router.navigate(['/mis-pedidos']);
            },
            (error) => {
              console.error('Error al crear detalles de venta:', error);
              // Aquí podrías implementar lógica para manejar el error, como revertir la venta
            }
        )
      }
    );
  }

    mostrarMensajeExito(): void {
    this.mensajeExito = '¡Compra realizada con éxito!';
    this.mostrarMensaje = true;
    setTimeout(() => {
      this.mostrarMensaje = false;
      this.router.navigate(['/mis-pedidos']);
    }, 3000);
  }

  mostrarMensajeError(): void {
    this.mensajeExito = 'Hubo un error al procesar tu compra. Por favor, inténtalo de nuevo.';
    this.mostrarMensaje = true;
    setTimeout(() => {
      this.mostrarMensaje = false;
    }, 3000);
  }


}

