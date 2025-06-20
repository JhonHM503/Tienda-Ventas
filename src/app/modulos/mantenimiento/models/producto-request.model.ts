export class ProductoRequest {
    idProducto?: number=0;
    idCategoria: number=0 ;
    idImagen: number=0 ;
    idTipoProducto: number=0
    nombre: string="";
    descripcion: string="" ;
    precio: number=0;
    stock: number=0;
    marcaAccesorio: string="";
    color: string="";
    material: string="";
    // idTipoFunda: number=0;
    // idTipoProtector: number=0;
    esUniversal: boolean=false;
    codigoProducto: string="";
}