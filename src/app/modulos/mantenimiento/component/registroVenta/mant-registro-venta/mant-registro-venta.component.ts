import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoResponse } from '../../../models/producto-response.model';
import { ClienteService } from '../../../service/cliente.service';
import { ProductoService } from '../../../service/producto.service';
import { VentaService } from '../../../service/venta.service';
import { DetalleVentaService } from '../../../service/detalle-venta.service';
import { ClienteRequest } from '../../../models/cliente-request.model';
import { VentaRequest } from '../../../models/venta-request.model';
import { DetalleVentaRequest } from '../../../models/datalleVenta-request.model';
import { TipoDocumentoResponse } from '../../../models/tipoDocumento-response.model';
import { MetodoPagoResponse } from '../../../models/metodoPago-response.model';
import { MetodoPagoService } from '../../../service/metodo-pago.service';
import { BoletaService } from '../../../service/boleta.service';
import jsPDF from 'jspdf';
import { ProductoRequest } from '../../../models/producto-request.model';

@Component({
  selector: 'app-mant-registro-venta',
  standalone: false,
  // imports: [],
  templateUrl: './mant-registro-venta.component.html',
  styleUrl: './mant-registro-venta.component.scss'
})
export class MantRegistroVentaComponent implements OnInit{
  clienteForm: FormGroup;
  terminoBusqueda: string = '';
  productosFiltrados: ProductoResponse[] = [];
  itemsCarrito: any[] = [];
  total: number = 0;
  mostrarSugerencias: boolean = false;

  tipoDcoumentos:TipoDocumentoResponse[]=[]
  metodosPago: MetodoPagoResponse[] = [];

  buscando = false;

  constructor(
    private fb: FormBuilder,
    private _clienteService: ClienteService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private detalleVentaService: DetalleVentaService,
    private _metodoPagoService:MetodoPagoService ,
    private _boletaService:BoletaService,
  ){
    this.clienteForm = this.fb.group({
      numeroDocumento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      idMetodoPago: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarMetodosPago();
  }

  cargarMetodosPago() {
    this._metodoPagoService.getAll().subscribe(
      (metodos: MetodoPagoResponse[]) => {
        this.metodosPago = metodos;
      },
      (error) => {
        console.error('Error al cargar métodos de pago:', error);
      }
    );
  }

  
  buscarCliente() {
    const dni = this.clienteForm.get('numeroDocumento')?.value;
    if (dni) {
      this.buscando = true;
      this._clienteService.buscarDNI(dni).subscribe(
        (cliente: ClienteRequest) => {
          this.clienteForm.patchValue({
            nombre: cliente.nombre,
            apellidoPaterno: cliente.apellidoPaterno,
            apellidoMaterno: cliente.apellidoMaterno
          });
          this.buscando = false;
        },
        (error) => {
          console.error('Error al buscar cliente:', error);
          // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
        }
      );
    }
  }


   buscarProductos() {
    if (this.terminoBusqueda.trim() === '') {
      this.productosFiltrados = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.productoService.getAll().subscribe(productos => {
      this.productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
      this.mostrarSugerencias = this.productosFiltrados.length > 0;
    });
  }

  
  agregarAlCarrito(producto: ProductoResponse) {
    const itemExistente = this.itemsCarrito.find(item => item.idProducto === producto.idProducto);
    if (itemExistente) {
      itemExistente.cantidad++;
      this.actualizarSubtotal(itemExistente);
    } else {
      const nuevoItem = { ...producto, cantidad: 1, subtotal: producto.precio };
      this.itemsCarrito.push(nuevoItem);
    }
    this.calcularTotal();
  }

  
  actualizarSubtotal(item: any) {

    // Validar que la cantidad esté dentro del rango permitido
  if (item.cantidad < 1) {
    item.cantidad = 1;
  } else if (item.cantidad > 20) {
    item.cantidad = 20;
  }
    item.subtotal = item.cantidad * item.precio;
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.itemsCarrito.reduce((sum, item) => sum + item.subtotal, 0);
  }

  
  eliminarDelCarrito(index: number) {
    this.itemsCarrito.splice(index, 1);
    this.calcularTotal();
  }

  private obtenerFechaActual(): string {
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset();
    const fechaLocal = new Date(ahora.getTime() - (offset*60*1000));
    return fechaLocal.toISOString().split('T')[0];
  }

  // registrarVenta() {
  //   const clienteRequest: ClienteRequest = {
  //     ...this.clienteForm.value,
  //     idCliente: 0,
  //     idTipoDocumento: 1, // Suponiendo que 1 es para DNI, ajustar según sea necesario
  //   };

  //   this._clienteService.create(clienteRequest).subscribe(clienteResponse => {
  //     const ventaRequest: VentaRequest = {
  //       idVenta: 0,
  //       idMetodoPago: this.clienteForm.get('idMetodoPago')?.value, // Suponiendo que 1 es para efectivo, ajustar según sea necesario
  //       fechaVenta: this.obtenerFechaActual(),
  //       total: this.total,
  //       idCliente: clienteResponse.idCliente,
  //       estadoVenta:true
  //     };

  //        this.ventaService.create(ventaRequest).subscribe(ventaResponse => {
  //       const promesasDetalle = this.itemsCarrito.map(item => {
  //         const detalleVentaRequest: DetalleVentaRequest = {
  //           idDetalleVenta: 0,
  //           idVenta: ventaResponse.idVenta,
  //           idProducto: item.idProducto,
  //           cantidad: item.cantidad,
  //           precioUnitario: item.precio,
  //           subtotal: item.subtotal,
  //         };
  //         return this.detalleVentaService.create(detalleVentaRequest).toPromise();
  //       });

  //       Promise.all(promesasDetalle).then(() => {
  //         alert('Venta registrada con éxito');
  //         this.imprimirBoleta(ventaResponse.idVenta, clienteResponse);
  //         this.limpiarFormulario();
  //       });
  //     });
  //   });
  // }
  // En el componente mant-registro-venta.component.ts

registrarVenta() {
  // Array para almacenar las verificaciones de stock
  const verificacionesStock = this.itemsCarrito.map(item => {
    return new Promise((resolve, reject) => {
      this.productoService.getById(item.idProducto).subscribe({
        next: (producto) => {
          if (producto.stock < item.cantidad) {
            reject({
              mensaje: `Stock insuficiente para el producto: ${producto.nombre}. Stock disponible: ${producto.stock}`
            });
          } else {
            resolve(true);
          }
        },
        error: (error) => reject(error)
      });
    });
  });

  // Verificar todo el stock antes de proceder
  Promise.all(verificacionesStock)
    .then(() => {
      // Proceder con la venta si hay stock suficiente
      const clienteRequest: ClienteRequest = {
        ...this.clienteForm.value,
        idCliente: 0,
        idTipoDocumento: 1,
      };

      this._clienteService.create(clienteRequest).subscribe({
        next: (clienteResponse) => {
          const ventaRequest: VentaRequest = {
            idVenta: 0,
            idMetodoPago: this.clienteForm.get('idMetodoPago')?.value,
            fechaVenta: this.obtenerFechaActual(),
            total: this.total,
            idCliente: clienteResponse.idCliente,
            estadoVenta: true
          };

          this.ventaService.create(ventaRequest).subscribe({
            next: (ventaResponse) => {
              // Array para almacenar todas las promesas de operaciones
              const operaciones: any[] = [];

              // Por cada item del carrito
              this.itemsCarrito.forEach(item => {
                // Crear detalle de venta
                const detalleVentaRequest: DetalleVentaRequest = {
                  idDetalleVenta: 0,
                  idVenta: ventaResponse.idVenta,
                  idProducto: item.idProducto,
                  cantidad: item.cantidad,
                  precioUnitario: item.precio,
                  subtotal: item.subtotal,
                };

                // Agregar promesa de creación de detalle de venta
                const detalleVentaPromise = this.detalleVentaService.create(detalleVentaRequest).toPromise();
                operaciones.push(detalleVentaPromise);

                // Actualizar stock
                const actualizarStockPromise = new Promise((resolve, reject) => {
                  this.productoService.getById(item.idProducto).subscribe({
                    next: (producto: ProductoResponse) => {
                      // Crear el objeto de actualización manteniendo todos los campos existentes
                      const productoActualizado: ProductoRequest = {
                        idProducto: producto.idProducto,
                        nombre: producto.nombre,
                        descripcion: producto.descripcion,
                        precio: producto.precio,
                        stock: producto.stock - item.cantidad,
                        idCategoria: producto.idCategoria,
                        idImagen: producto.idImagen,
                        idTipoProducto: producto.idTipoProducto,
                        marcaAccesorio: producto.marcaAccesorio,
                        color: producto.color,
                        material: producto.material,
                        // idTipoFunda: producto.idTipoFunda,
                        // idTipoProtector: producto.idTipoProtector,
                        esUniversal: producto.esUniversal,   
                        codigoProducto: producto.codigoProducto,
                      };

                      this.productoService.update(productoActualizado).subscribe({
                        next: () => resolve(true),
                        error: (error) => reject(error)
                      });
                    },
                    error: (error) => reject(error)
                  });
                });

                operaciones.push(actualizarStockPromise);
              });

              // Ejecutar todas las operaciones
              Promise.all(operaciones)
                .then(() => {
                  alert('Venta registrada con éxito');
                  this.imprimirBoleta(ventaResponse.idVenta, clienteResponse);
                  this.limpiarFormulario();
                })
                .catch(error => {
                  console.error('Error al procesar la venta:', error);
                  alert('Ocurrió un error al procesar la venta');
                });
            },
            error: (error) => {
              console.error('Error al crear la venta:', error);
              alert('Error al crear la venta');
            }
          });
        },
        error: (error) => {
          console.error('Error al crear el cliente:', error);
          alert('Error al crear el cliente');
        }
      });
    })
    .catch(error => {
      alert(error.mensaje || 'Error al verificar el stock de los productos');
    });
}

  imprimirBoleta(idVenta: number, cliente: ClienteRequest) {
    const imprimirBoletaInterna = () => {
      const contenidoBoleta = this.generarContenidoBoleta(idVenta, cliente);
      const ventanaImpresion = window.open('', '_blank');
      if (ventanaImpresion) {
        ventanaImpresion.document.write(contenidoBoleta);
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
    };

    imprimirBoletaInterna();
  } 

  generarContenidoBoleta(idVenta: number, cliente: ClienteRequest): string {
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
            <p>N° B00-${idVenta}</p>
          </div>
          
          <div class="cliente-info">
            <p>CLIENTE: ${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}</p>
            <p>IDENTIFICACIÓN: ${cliente.numeroDocumento}</p>
            <p>FECHA EMISIÓN: ${this.obtenerFechaActual()}</p>
            <p>MONEDA: SOLES</p>
            <p>F. PAGO: CONTADO</p>
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
    
    this.itemsCarrito.forEach(item => {
      contenido += `
       <tr>
        <td colspan="5">
        <span class="producto-codigo">${item.idProducto}</span>
          ${item.nombre}
        </td>
      </tr>
      <tr>
        <td></td>
        <td>${item.cantidad}</td>
        <td>UND/1</td>
        <td>${item.precio.toFixed(2)}</td>
        <td>${item.subtotal.toFixed(2)}</td>
      </tr>
      `;
    });

    contenido += `
          </table>
           <div class="total-info">
              <p>MONTO TOTAL: S/. ${this.total.toFixed(2)}</p>
               <p>SON: ${this.total} SOLES</p>
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

  getCategoriaName(idTipoDocumento: number): string {
  const tipoDocumento = this.tipoDcoumentos.find(c => c.idTipoDocumento === idTipoDocumento);
  return tipoDocumento ? tipoDocumento.nombre : 'Desconocido';
  }

  limpiarFormulario() {
    this.clienteForm.reset();
    this.itemsCarrito = [];
    this.total = 0;
  }

}
