export class VentaRequest {
    idVenta: number=0;
    idUsuario?: number=0;
    idMetodoPago: number=0;
    fechaVenta: string="";
    total: number=0;
    idCliente?: number=0;
    estadoVenta: boolean = false 
}