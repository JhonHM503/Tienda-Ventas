  import { Component, OnInit } from '@angular/core';
  import { DetalleVentaResponse } from 'src/app/modulos/mantenimiento/models/datalleVenta-response.model';
  import { MetodoPagoResponse } from 'src/app/modulos/mantenimiento/models/metodoPago-response.model';
  import { VentaResponse } from 'src/app/modulos/mantenimiento/models/venta-response.model';

  import { FormBuilder, FormGroup } from '@angular/forms';
  import { VentaService } from 'src/app/modulos/mantenimiento/service/venta.service';
  import { DetalleVentaService } from 'src/app/modulos/mantenimiento/service/detalle-venta.service';
  import { MetodoPagoService } from 'src/app/modulos/mantenimiento/service/metodo-pago.service';
  import { ProductoService } from 'src/app/modulos/mantenimiento/service/producto.service';
  import { ClienteService } from 'src/app/modulos/mantenimiento/service/cliente.service';
  import { forkJoin } from 'rxjs';
  import { ProductoResponse } from 'src/app/modulos/mantenimiento/models/producto-response.model';
  import { ClienteResponse } from 'src/app/modulos/mantenimiento/models/cliente-response.model';
  import { CommonModule } from '@angular/common';
  import { SharedModule } from 'src/app/modulos/shared/shared.module';
  import { UsuarioResponse } from 'src/app/modulos/mantenimiento/models/usuario-response.model';
  import { PersonaResponse } from 'src/app/modulos/mantenimiento/models/persona-response.model';
  import { UsuarioService } from 'src/app/modulos/mantenimiento/service/usuario.service';
  import { PersonaService } from 'src/app/modulos/mantenimiento/service/persona.service';
  import { VentaRequest } from 'src/app/modulos/mantenimiento/models/venta-request.model';
  import { TipoDocumentoResponse } from 'src/app/modulos/mantenimiento/models/tipoDocumento-response.model';
  import { TipoDocumentoService } from 'src/app/modulos/mantenimiento/service/tipo-documento.service';

  @Component({
    selector: 'app-general-ventas',
    standalone: true,
    imports: [CommonModule,SharedModule],
    templateUrl: './general-ventas.component.html',
    styleUrl: './general-ventas.component.scss'
  })
  export class GeneralVentasComponent implements OnInit { 

    ventas:VentaResponse[]=[];
    ventasFiltradas: VentaResponse[] = [];
    detallesVenta: DetalleVentaResponse[] = [];
    ventaSeleccionada: number | null = null;

    metodoPagos: MetodoPagoResponse[]=[];
    productos: ProductoResponse[] = [];
    clientes:ClienteResponse[]=[];
    usuarios: UsuarioResponse[] = [];
    personas: PersonaResponse[] = [];
    tiposDocumento: TipoDocumentoResponse[] = [];

    totalVentas: number = 0;
    totalOrdenesPendientes: number = 0;
    totalProductosVendidos: number = 0;
    clientesNuevos: number = 0;

    // Propiedades para los filtros
  
    metodoPagoSeleccionado: number | null = null;
    clienteSeleccionado: number | null = null;
  

    filterForm :FormGroup; 
    
    constructor(
      private _ventasService:VentaService,
      private _detalleventasService:DetalleVentaService,
      private _metodoPagoService: MetodoPagoService,
      private _productoService: ProductoService,
      // private _clientesService:ClienteService,
      private _usuarioService: UsuarioService,
      private _personaService: PersonaService,
      private _tipoDocumentoService: TipoDocumentoService,
      private formBuilder: FormBuilder
    ){
      this.filterForm = this.formBuilder.group({

        metodoPago: [null],
        // clienteNombre: [''],
        usuarioNombre: [''],
        dni: [''],
        fechaInicio: [null],
        fechaFin: [null]
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
        // clientes: this._clientesService.getAll(),
        usuarios:this._usuarioService.getAll(),
        personas: this._personaService.getAll(),
        tiposDocumento: this._tipoDocumentoService.getAll()
      }).subscribe({
        next: (result) => {
          this.ventas = result.ventas.filter(venta => venta.idUsuario != null).reverse();
          this.ventasFiltradas = [...this.ventas];
          this.metodoPagos = result.metodosPago;
          this.productos = result.productos;
          // this.clientes = result.clientes;
          this.usuarios = result.usuarios;
          this.personas = result.personas;
          this.tiposDocumento = result.tiposDocumento;
          this.calcularTotales();
          console.log("Datos cargados", result);
        },
        error: (err) => {
          console.error("Error al cargar los datos", err);
        }
      });
    }

    aplicarFiltros() {
      const filtros = this.filterForm.value;

      this.ventasFiltradas = this.ventas.filter(venta => {
        const fechaVenta = new Date(venta.fechaVenta);
        // const clienteNombre = this.getNombreCliente(venta.idUsuario).toLowerCase();
        const usuario = this.usuarios.find(u => u.idUsuario === venta.idUsuario);
        const persona = usuario ? this.personas.find(p => p.idPersona === usuario.idPersona) : null;
        const nombreCompleto = persona ? 
          `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`.toLowerCase() : '';
        const dni = persona ? persona.numeroDocumento : '';
        return (
            (!filtros.metodoPago || venta.idMetodoPago === parseInt(filtros.metodoPago)) &&
          // (!filtros.clienteNombre || clienteNombre.includes(filtros.clienteNombre.toLowerCase())) &&
          (!filtros.usuarioNombre || nombreCompleto.includes(filtros.usuarioNombre.toLowerCase())) &&
          (!filtros.dni || dni.includes(filtros.dni)) &&
          (!filtros.fechaInicio || fechaVenta >= new Date(filtros.fechaInicio)) &&
          (!filtros.fechaFin || fechaVenta <= new Date(filtros.fechaFin))
        );
      });
      this.calcularTotales();
    }
    

    limpiarFiltros() {
      this.filterForm.reset();
      this.ventasFiltradas = [...this.ventas];
      this.calcularTotales();
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

    // getNombreCliente(idCliente: number): string {
    //   const cliente = this.clientes.find(c => c.idCliente === idCliente);
    //   if (cliente) {
    //     return `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`.trim();
    //   }
    //     return 'Desconocido';
    // }

    getNombreCompletoUsuario(idUsuario: number): string {
    const usuario = this.usuarios.find(u => u.idUsuario === idUsuario);
    if (usuario) {
      const persona = this.personas.find(p => p.idPersona === usuario.idPersona);
      if (persona) {
        return `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`.trim();
      }
    }
    return 'Usuario Desconocido';
    }


    cambiarEstadoVenta(venta: VentaResponse) {
      const ventaActualizada: VentaRequest = {
        idVenta: venta.idVenta,
        idUsuario: venta.idUsuario,
        idMetodoPago: venta.idMetodoPago,
        fechaVenta: venta.fechaVenta,
        total: venta.total,
        idCliente: venta.idCliente,
        estadoVenta: !venta.estadoVenta
      };

      this._ventasService.update(ventaActualizada).subscribe({
        next: (ventaActualizadaResponse: VentaResponse) => {
          console.log('Venta actualizada:', ventaActualizadaResponse);
          // Actualizar la venta en el array local
          const index = this.ventas.findIndex(v => v.idVenta === venta.idVenta);
          if (index !== -1) {
            this.ventas[index] = ventaActualizadaResponse;
            this.ventasFiltradas = [...this.ventas]; // Actualizar la vista
          }
        },
        error: (err) => {
          console.error('Error al actualizar la venta:', err);
          // No necesitamos revertir el cambio aquí, ya que no hemos modificado el estado local
        }
      });
    }

    getEstadoVentaTexto(estado: boolean): string {
      return estado ? 'Entregado' : 'Pendiente';
    }

    getNumeroDocumento(idUsuario: number): string {
    const usuario = this.usuarios.find(u => u.idUsuario === idUsuario);
    if (usuario) {
      const persona = this.personas.find(p => p.idPersona === usuario.idPersona);
      return persona ? persona.numeroDocumento : 'N/A';
    }
    return 'N/A';
  }

   getTipoDocumento(idUsuario: number): string {
    const usuario = this.usuarios.find(u => u.idUsuario === idUsuario);
    if (usuario) {
      const persona = this.personas.find(p => p.idPersona === usuario.idPersona);
      if (persona) {
        const tipoDocumento = this.tiposDocumento.find(td => td.idTipoDocumento === persona.idTipoDocumento);
        return tipoDocumento ? tipoDocumento.nombre : 'Desconocido';
      }
    }
    return 'N/A';
  }

    calcularTotales() {
    this.totalVentas = this.ventas.reduce((sum, venta) => sum + venta.total, 0);
    this.totalOrdenesPendientes = this.ventas.filter(venta => !venta.estadoVenta).length;
     // Calcular total de productos vendidos
    this.totalProductosVendidos = this.detallesVenta.reduce((sum, detalle) => sum + detalle.cantidad, 0);
    
    // Calcular clientes nuevos (usuarios que realizan su primera compra)
    const usuariosUnicos = new Set(this.ventas.map(venta => venta.idUsuario));
    this.clientesNuevos = usuariosUnicos.size;
  }

  generarBoleta(venta: VentaResponse) {
  // Primero obtenemos los detalles de la venta
  this._detalleventasService.getAll().subscribe({
    next: (data: DetalleVentaResponse[]) => {
      this.detallesVenta = data.filter(detalle => detalle.idVenta === venta.idVenta);
      this.imprimirBoleta(venta);
    },
    error: (err) => {
      console.error("Error al obtener detalles de venta", err);
    }
  });
}

imprimirBoleta(venta: VentaResponse) {
  const ventanaImpresion = window.open('', '_blank');
  if (ventanaImpresion) {
    ventanaImpresion.document.write(this.generarContenidoBoleta(venta));
    ventanaImpresion.document.close();
    
    ventanaImpresion.onafterprint = () => {
      ventanaImpresion.close();
    };

    ventanaImpresion.onload = () => {
      setTimeout(() => {
        ventanaImpresion.print();
      }, 250);
    };
  } else {
    console.error('No se pudo abrir la ventana de impresión');
    alert('No se pudo imprimir la boleta. Por favor, revise la configuración de su navegador.');
  }
}
generarContenidoBoleta(venta: VentaResponse): string {
  const usuario = this.usuarios.find(u => u.idUsuario === venta.idUsuario);
  const persona = usuario ? this.personas.find(p => p.idPersona === usuario.idPersona) : null;

  let contenido = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Boleta de Venta</title>
      <style>
        body { 
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.2;
        }
        .boleta { 
          width: 300px; 
          margin: 0 auto;
          padding: 10px;
        }
        .logo { 
          text-align: center;
          margin-bottom: 5px;
        }
        .logo img {
          width: 100px;
        }
        .empresa-info {
          text-align: center;
          margin-bottom: 10px;
        }
        .empresa-info p {
          margin: 2px 0;
        }
        .documento-info {
          text-align: center;
          margin-bottom: 10px;
          border-top: 1px dashed #000;
          border-bottom: 1px dashed #000;
          padding: 5px 0;
        }
        .cliente-info {
          margin-bottom: 10px;
        }
        .cliente-info p {
          margin: 2px 0;
        }
        table { 
          width: 100%;
          margin: 10px 0;
        }
        th, td { 
          padding: 3px;
          text-align: left;
          border: none;
        }
        .producto-codigo {
          font-size: 11px;
          color: #666;
        }
        .total-info {
          margin-top: 10px;
          border-top: 1px dashed #000;
          padding-top: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 15px;
          font-size: 11px;
        }
        .footer p {
          margin: 2px 0;
        }
      </style>
    </head>
    <body>
      <div class="boleta">
        <div class="logo">
          <p style="font-size: 24px; font-weight: bold;">YANIN</p>
        </div>
        <div class="empresa-info">
          <p>MACROTIENDA YANIN</p>
          <p>INVERSIONES MANEJO SAC</p>
          <p>02 TIENDA REAL HUANCAYO</p>
          <p>AV.NACION WANKAS 145 HUANCAYO. DE JUNIN</p>
          <p>JUNIN</p>
          <p>Tel. 064 343456</p>
          <p>HUANCAYO HUANCAYO JUNIN</p>
          <p>R.U.C. 10410784110</p>
        </div>
      
        <div class="documento-info">
          <p>BOLETA ELECTRÓNICA</p>
          <p>N° B00-${venta.idVenta}</p>
        </div>
        
        <div class="cliente-info">
          <p>CLIENTE: ${persona ? `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}` : 'Cliente General'}</p>
          <p>IDENTIFICACIÓN: ${persona ? persona.numeroDocumento : 'Sin documento'}</p>
          <p>FECHA EMISIÓN: ${new Date(venta.fechaVenta).toLocaleDateString('es-PE')}</p>
          <p>MONEDA: SOLES</p>
          <p>F. PAGO: ${this.getNombreMetodoPago(venta.idMetodoPago)}</p>
        </div>
        <table>
          <tr>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Precio</th>
            <th>TOTAL</th>
          </tr>
  `;
  
  this.detallesVenta.forEach(detalle => {
    const producto = this.productos.find(p => p.idProducto === detalle.idProducto);
    contenido += `
     <tr>
      <td colspan="5">
      <span class="producto-codigo">${detalle.idProducto}</span>
        ${producto ? producto.nombre : 'Producto no encontrado'}
      </td>
    </tr>
    <tr>
      <td></td>
      <td>${detalle.cantidad}</td>
      <td>UND/1</td>
      <td>${detalle.precioUnitario.toFixed(2)}</td>
      <td>${detalle.subtotal.toFixed(2)}</td>
    </tr>
    `;
  });

  contenido += `
        </table>
         <div class="total-info">
            <p>MONTO TOTAL: S/. ${venta.total.toFixed(2)}</p>
             <p>SON: ${venta.total.toFixed(2)} SOLES</p>
          </div>
          <div class="footer">
            <p>El comprobante puede ser consultado en SUNAT</p>
            <p>https://bit.ly/3uxF4mJ</p>
            <p>*** GRACIAS POR SU PREFERENCIA ***</p>
            <p>TODO RECLAMO DEBERÁ EFECTUARSE EN UN PLAZO</p>
            <p>MÁXIMO DE 24 HORAS, ACOMPAÑADO DE LOS</p>
            <p>EMPAQUES ORIGINALES DEBIDAMENTE SELLADOS Y</p>
            <p>DEL COMPROBANTE DE PAGO CORRESPONDIENTE.</p>
          </div>  
      </div>
    </body>
    </html>
  `;

  return contenido;
}
}
