import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../service/venta.service';
import { VentaResponse } from '../../../models/venta-response.model';
import { DetalleVentaService } from '../../../service/detalle-venta.service';
import { DetalleVentaResponse } from '../../../models/datalleVenta-response.model';
import { MetodoPagoResponse } from '../../../models/metodoPago-response.model';
import { ProductoResponse } from '../../../models/producto-response.model';
import { MetodoPagoService } from '../../../service/metodo-pago.service';
import { ProductoService } from '../../../service/producto.service';
import { forkJoin } from 'rxjs';
import { ClienteResponse } from '../../../models/cliente-response.model';
import { ClienteService } from '../../../service/cliente.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mant-historial-venta',
  standalone: false,
  // imports: [],
  templateUrl: './mant-historial-venta.component.html',
  styleUrl: './mant-historial-venta.component.scss'
})
export class MantHistorialVentaComponent implements OnInit {


  ventas:VentaResponse[]=[];
  ventasDelDia: VentaResponse[] = [];
  ventasFiltradas: VentaResponse[] = [];
  detallesVenta: DetalleVentaResponse[] = [];
  ventaSeleccionada: number | null = null;

  metodoPagos: MetodoPagoResponse[]=[];
  productos: ProductoResponse[] = [];
  clientes:ClienteResponse[]=[];

  hayVentasHoy: boolean = false;

  // Propiedades para los filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  metodoPagoSeleccionado: number | null = null;
  clienteSeleccionado: number | null = null;
  totalMinimo: number | null = null;
  totalMaximo: number | null = null;

  filterForm :FormGroup; 
  
  constructor(
    private _ventasService:VentaService,
    private _detalleventasService:DetalleVentaService,
    private _metodoPagoService: MetodoPagoService,
    private _productoService: ProductoService,
    private _clientesService:ClienteService,
     private formBuilder: FormBuilder
  ){
    this.filterForm = this.formBuilder.group({
      // fechaInicio: [''],
      // fechaFin: [''],
      metodoPago: [null],
      clienteNombre: [''],
      totalMinimo: [null],
      totalMaximo: [null]
    });
  }

  ngOnInit(): void {

    this.cargarDatos();
    
  }
  
  cargarDatos(){
     forkJoin({
      ventas: this._ventasService.getAll(),
      metodosPago: this._metodoPagoService.getAll(),
      productos: this._productoService.getAll(),
      clientes: this._clientesService.getAll()
    }).subscribe({
      next: (result) => {
        this.ventas = result.ventas.filter(venta => venta.idCliente != null).reverse();
        this.metodoPagos = result.metodosPago;
        this.productos = result.productos;
        this.clientes = result.clientes;
        this.filtrarVentasDelDia();
        this.ventasFiltradas = [...this.ventasDelDia];
        console.log("Datos cargados", result);
      },
      error: (err) => {
        console.error("Error al cargar los datos", err);
      }
    });
  }

  filtrarVentasDelDia() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    this.ventasDelDia = this.ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaVenta);
      return fechaVenta >= hoy && fechaVenta < mañana;
    });

    this.hayVentasHoy = this.ventasDelDia.length > 0;
  }

  aplicarFiltros() {
    const filtros = this.filterForm.value;

    this.ventasFiltradas = this.ventasDelDia.filter(venta => {
      const clienteNombre = this.getNombreCliente(venta.idCliente).toLowerCase();
      return (
        (!filtros.metodoPago || venta.idMetodoPago === parseInt(filtros.metodoPago)) &&
        (!filtros.clienteNombre || clienteNombre.includes(filtros.clienteNombre.toLowerCase())) &&
        (!filtros.totalMinimo || venta.total >= filtros.totalMinimo) &&
        (!filtros.totalMaximo || venta.total <= filtros.totalMaximo)
      );
    });
  }

  

  limpiarFiltros() {
    this.filterForm.reset();
    this.ventasFiltradas = [...this.ventasDelDia];
  }

  listarVentas()
  {
    this._ventasService.getAll().subscribe({
      next:(data:VentaResponse[])=>{
        this.ventas=data
        console.log("ventas",data);
      },
      error:(err)=>{
        console.log("error",err);
      },
      complete:()=>{
        //falta
      },
    });
  }

  verDetalleVenta(idVenta: number) {
    this.ventaSeleccionada = idVenta;
    this._detalleventasService.getAll().subscribe({
      next: (data: DetalleVentaResponse[]) => {
        this.detallesVenta = data.filter(detalle => detalle.idVenta === idVenta);
        console.log("detalles venta", this.detallesVenta);
      },
      error: (err) => {
        console.error("Error al obtener detalles de venta", err);
      }
    });
  }

  cerrarDetalleVenta() {
    this.ventaSeleccionada = null;
    this.detallesVenta = [];
  }

  getNombreMetodoPago(idMetodoPago: number): string {
    const metodoPago = this.metodoPagos.find(m => m.idMetodoPago === idMetodoPago);
    return metodoPago ? metodoPago.nombre : 'Desconocido';
  }

  getNombreProducto(idProducto: number): string {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    return producto ? producto.nombre : 'Desconocido';
  }

  getNombreCliente(idCliente: number): string {
    const cliente = this.clientes.find(c => c.idCliente === idCliente);
    if (cliente) {
      return `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`.trim();
    }
      return 'Desconocido';
  }
}
