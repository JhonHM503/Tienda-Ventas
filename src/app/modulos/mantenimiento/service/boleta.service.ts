import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoletaService {

  constructor() { }

  generaBoleta(venta: any, cliente:any, items:any[]):string{
    const itemsHTML = items.map(item =>
      `<tr>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>S/. ${item.precio.toFixed(2)}</td>
        <td>S/. ${item.subtotal.toFixed(2)}</td>
      </tr>`
    ).join('');

    return`
        <html>
        <head>
          <title>Boleta de Venta</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Boleta de Venta</h1>
          <p><strong>Cliente:</strong> ${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}</p>
          <p><strong>DNI:</strong> ${cliente.numeroDocumento}</p>
          <p><strong>Fecha:</strong> ${venta.fechaVenta}</p>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          <p><strong>Total:</strong> S/. ${venta.total.toFixed(2)}</p>
        </body>
      </html>
      `;
  }
   abrirVentanaImpresion(contenidoHTML: string) {
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(contenidoHTML);
      ventanaImpresion.document.close();
      ventanaImpresion.focus();
      ventanaImpresion.print();
      ventanaImpresion.close();
    } else {
      console.error('No se pudo abrir la ventana de impresión');
    }
  }
}
