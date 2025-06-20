import { Component, OnInit } from '@angular/core';
import { VentaResponse } from '../../../models/venta-response.model';
import { DetalleVentaResponse } from '../../../models/datalleVenta-response.model';
import { MetodoPagoResponse } from '../../../models/metodoPago-response.model';
import { ProductoResponse } from '../../../models/producto-response.model';
import { ClienteResponse } from '../../../models/cliente-response.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VentaService } from '../../../service/venta.service';
import { DetalleVentaService } from '../../../service/detalle-venta.service';
import { MetodoPagoService } from '../../../service/metodo-pago.service';
import { ProductoService } from '../../../service/producto.service';
import { ClienteService } from '../../../service/cliente.service';
import { forkJoin } from 'rxjs';
import { UsuarioService } from '../../../service/usuario.service';
import { UsuarioResponse } from '../../../models/usuario-response.model';
import { PersonaService } from '../../../service/persona.service';
import { PersonaResponse } from '../../../models/persona-response.model';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-reporte-ventas',
  standalone: false,
  // imports: [],
  templateUrl: './reporte-ventas.component.html',
  styleUrl: './reporte-ventas.component.scss'
})
export class ReporteVentasComponent implements OnInit {
  
  ventas:VentaResponse[]=[];
  ventasFiltradas: VentaResponse[] = [];
  detallesVenta: DetalleVentaResponse[] = [];
  ventaSeleccionada: number | null = null;

  metodoPagos: MetodoPagoResponse[]=[];
  productos: ProductoResponse[] = [];
  clientes:ClienteResponse[]=[];
  usuarios:UsuarioResponse[]=[];
  personas:PersonaResponse[]=[];

   // Propiedades para paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  ventasPaginadas: VentaResponse[] = [];

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
    private _usuarioService:UsuarioService,
    private _personasService:PersonaService,
    private formBuilder: FormBuilder
  ){
    this.filterForm = this.formBuilder.group({
      fechaInicio: [''],
      fechaFin: [''],
      metodoPago: [''],
      nombreComprador: [''],
      totalMinimo: [null],
      totalMaximo: [null]
    });

    // Suscribirse a cambios en totalMinimo para validar totalMaximo
  // this.filterForm.get('totalMinimo')?.valueChanges.subscribe(value => {
  //   const totalMax = this.filterForm.get('totalMaximo');
  //   if (totalMax?.value && value && parseFloat(totalMax.value) < parseFloat(value)) {
  //     totalMax.setValue(value);
  //   }
  // });
  // Modificación de la suscripción para comparar números correctamente
  this.filterForm.get('totalMinimo')?.valueChanges.subscribe(value => {
    const totalMax = this.filterForm.get('totalMaximo');
    const valorMinimo = value ? parseFloat(value) : null;
    const valorMaximo = totalMax?.value ? parseFloat(totalMax.value) : null;
    
    if (valorMinimo !== null && valorMaximo !== null && valorMaximo < valorMinimo) {
      totalMax?.setValue(valorMinimo);
    }
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
      clientes: this._clientesService.getAll(),
      usuarios:this._usuarioService.getAll(),
      personas:this._personasService.getAll(),
    }).subscribe({
      next: (result) => {
        this.ventas = result.ventas.reverse();
        this.metodoPagos = result.metodosPago;
        this.productos = result.productos;
        this.clientes = result.clientes;
        this.usuarios = result.usuarios;
        this.personas = result.personas; 
        this.ventasFiltradas = [...this.ventas];
        this.totalItems = this.ventasFiltradas.length;
        this.pageChanged({ page: 1, itemsPerPage: this.itemsPerPage });
        console.log("Datos cargados", result);
      },
      error: (err) => {
        console.error("Error al cargar los datos", err);
      }
    });
  }
  
  // Método para manejar el cambio de página
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.ventasPaginadas = this.ventasFiltradas.slice(startItem, endItem);
    this.currentPage = event.page;
  }

  // Método auxiliar para validar el total máximo
  validarTotalMax(event: any) {
  const totalMin = this.filterForm.get('totalMinimo')?.value ? parseFloat(this.filterForm.get('totalMinimo')?.value) : null;
  const totalMax = event.target.value ? parseFloat(event.target.value) : null;
  
  if (totalMin !== null && totalMax !== null && totalMax < totalMin) {
    this.filterForm.patchValue({
      totalMaximo: totalMin
    });
  }
}

   aplicarFiltros() {
    const filtros = this.filterForm.value;
    this.ventasFiltradas = this.ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaVenta);
      const nombreComprador = this.getNombreComprador(venta).toLowerCase();
      const totalMin = filtros.totalMinimo ? parseFloat(filtros.totalMinimo) : null;
      const totalMax = filtros.totalMaximo ? parseFloat(filtros.totalMaximo) : null;
      return (
        (!filtros.fechaInicio || fechaVenta >= new Date(filtros.fechaInicio)) &&
        (!filtros.fechaFin || fechaVenta <= new Date(filtros.fechaFin)) &&
        (!filtros.metodoPago || venta.idMetodoPago === parseInt(filtros.metodoPago)) &&
        (!filtros.nombreComprador || nombreComprador.includes(filtros.nombreComprador.toLowerCase())) &&
        (totalMin === null || venta.total >= totalMin) &&
        (totalMax === null || venta.total <= totalMax)
      );
    });
    this.totalItems = this.ventasFiltradas.length;
    this.pageChanged({ page: 1, itemsPerPage: this.itemsPerPage });
  }
 
  limpiarFiltros() {
    this.filterForm.reset();
    this.ventasFiltradas = [...this.ventas];
    this.totalItems = this.ventasFiltradas.length;
    this.pageChanged({ page: 1, itemsPerPage: this.itemsPerPage });
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

   exportarPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['ID Venta', 'Cliente', 'Método de Pago', 'Total', 'Fecha Venta']],
      body: this.ventasFiltradas.map(venta => [
        venta.idVenta,
        this.getNombreComprador(venta),
        this.getNombreMetodoPago(venta.idMetodoPago),
        `S/. ${venta.total.toFixed(2)}`,
        new Date(venta.fechaVenta).toLocaleDateString()
      ])
    });
    doc.save('reporte_ventas.pdf');
  }

  exportarExcel() {
    const data = this.ventasFiltradas.map(venta => ({
      'ID Venta': venta.idVenta,
      'Cliente': this.getNombreComprador(venta),
      'Método de Pago': this.getNombreMetodoPago(venta.idMetodoPago),
      'Total': venta.total,
      'Fecha Venta': new Date(venta.fechaVenta).toLocaleDateString()
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Ventas');
    XLSX.writeFile(wb, 'reporte_ventas.xlsx');
  }

  getNombreComprador(venta: VentaResponse): string {
    if (venta.idCliente) {
      const cliente = this.clientes.find(c => c.idCliente === venta.idCliente);
      return cliente ? `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}` : 'Cliente Desconocido';
    } else if (venta.idUsuario) {
      const usuario = this.usuarios.find(u => u.idUsuario === venta.idUsuario);
      if (usuario) {
        const persona = this.personas.find(p => p.idPersona === usuario.idPersona);
        return persona ? `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}` : 'Usuario Desconocido';
      }
    }
    return 'Comprador No Registrado';
  }


  getNombreMetodoPago(idMetodoPago: number): string {
    const metodoPago = this.metodoPagos.find(m => m.idMetodoPago === idMetodoPago);
    return metodoPago ? metodoPago.nombre : 'Desconocido';
  }

  getNombreProducto(idProducto: number): string {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    return producto ? producto.nombre : 'Desconocido';
  }

}
