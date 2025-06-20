import { Component, OnInit, TemplateRef } from '@angular/core';
import { VProducto } from '../../../models/VProductos.model';
import { ProductoResponse } from '../../../models/producto-response.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductoService } from '../../../service/producto.service';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { forkJoin, ignoreElements } from 'rxjs';
import { CategoriaService } from '../../../service/categoria.service';
import { CategoriaResponse } from '../../../models/categoria-response.model';
import { ImagenService } from '../../../service/imagen.service';
import { ImagenResponse } from '../../../models/imagen-response.model';
import { Router } from '@angular/router';
import { alert_confirm_delete, alert_delete_error, alert_delete_success } from 'src/app/functions/general.functions';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TipoFundaResponse } from '../../../models/tipoFunda-response.model';
import { TipoFundaService } from '../../../service/tipo-funda.service';
import { TipoProtectorResponse } from '../../../models/tipoProtector-response.model';
import { TipoProtectorService } from '../../../service/tipo-protector.service';
import { TipoProductoResponse } from '../../../models/tipoProducto-response.model';
import { TipoProductoService } from '../../../service/tipo-producto.service';

@Component({
  selector: 'app-mant-producto-list',
  standalone: false,
  // imports: [],
  templateUrl: './mant-producto-list.component.html',
  styleUrl: './mant-producto-list.component.scss'
})

export class MantProductoListComponent implements OnInit {

  productos: ProductoResponse[]=[];
  productoSelected:ProductoResponse=new ProductoResponse();
  imagenSelected:ImagenResponse=new ImagenResponse();
  vProductos:VProducto[] = [];
  genericFilterRequest: GenericFilterRequest = new GenericFilterRequest();

  productosConImagenes: Array<{producto: ProductoResponse, imagen: ImagenResponse}> = [];
  filteredProductosConImagenes: Array<{producto: ProductoResponse, imagen: ImagenResponse}> = [];

  // Propiedades para paginación
  currentPage: number = 1;
  itemsPerPage: number = 8; // Puedes ajustar esto según necesites
  totalItems: number = 0;
  
  // Esta propiedad contendrá los elementos de la página actual
  productosConImagenesPaginados: Array<{producto: ProductoResponse, imagen: ImagenResponse}> = [];

  //OBTENER DE MANERA NO OPTIMA
  categorias:CategoriaResponse[]=[]
  // tipoFundas:TipoFundaResponse[]=[]
  // tipoProtectores:TipoProtectorResponse[]=[]
  tipoProductos:TipoProductoResponse[]=[]

  modalRef?: BsModalRef;
  titleModal:string="";
  accionModal:number=0;
  filterForm :FormGroup; 

  constructor(
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _imagenService: ImagenService,
    private _categoriaService: CategoriaService,
    private _tipoProductoService: TipoProductoService,
    // private _tipoFundaService: TipoFundaService,
    // private _tipoProtectorService: TipoProtectorService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.filterForm =this.fb.group({
      nombre: [''],
      categoria: [''],
      // precio: [''],
      precioMin: [''],
      precioMax: [''],
      descripcion: [''],
    });

    // Suscribirse a cambios en precioMin para validar precioMax
    this.filterForm.get('precioMin')?.valueChanges.subscribe(value => {
      const precioMax = this.filterForm.get('precioMax');
      if (precioMax?.value && value && parseFloat(precioMax.value) < parseFloat(value)) {
        precioMax.setValue(value);
      }
    });
   }

  ngOnInit(): void {
    this.listarProductos();
    this.obternerListas();
  }

  listarProductos(): void {
   this._productoService.getAll().subscribe({
      next: (productos: ProductoResponse[]) => {
        const observables = productos.map(producto => 
          this._imagenService.getById(producto.idImagen)
        );
        
        forkJoin(observables).subscribe({
          next: (imagenes: ImagenResponse[]) => {
            this.productosConImagenes = productos.map((producto, index) => ({
              producto,
              imagen: imagenes[index]
            }));
            this.filteredProductosConImagenes = [...this.productosConImagenes.reverse()];
            this.totalItems = this.filteredProductosConImagenes.length;
            this.pageChanged({ page: 1, itemsPerPage: this.itemsPerPage });
          },
          error: (err) => console.error("Error fetching personas", err)
        });
      },
      error: (err) => console.error("Error fetching usuarios", err)
    });
  }

  aplicaFiltros() {
  const filtros = this.filterForm.value;

  this.filteredProductosConImagenes = this.productosConImagenes.filter(item => {
    const precioMin = filtros.precioMin ? parseFloat(filtros.precioMin) : null;
    const precioMax = filtros.precioMax ? parseFloat(filtros.precioMax) : null;
    return (
      (filtros.nombre ? item.producto.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) : true) &&
      (filtros.categoria ? item.producto.idCategoria === parseInt(filtros.categoria) : true) &&
      // (filtros.precio ? item.producto.precio === parseInt(filtros.precio) : true) &&
      (precioMin ? item.producto.precio >= precioMin : true) &&
      (precioMax ? item.producto.precio <= precioMax : true) &&
      (filtros.descripcion ? item.producto.descripcion.toLocaleLowerCase().includes(filtros.descripcion.toLowerCase()) : true)
    );
  });
    this.totalItems = this.filteredProductosConImagenes.length;
    this.pageChanged({ page: 1, itemsPerPage: this.itemsPerPage }); // Reset a la primera página
}


  // Método para manejar el cambio de página
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.productosConImagenesPaginados = this.filteredProductosConImagenes.slice(startItem, endItem);
    this.currentPage = event.page;
  }

 // Método auxiliar para validar el precio máximo
  validarPrecioMax(event: any) {
    const precioMin = parseFloat(this.filterForm.get('precioMin')?.value || '0');
    const precioMax = parseFloat(event.target.value || '0');
    
    if (precioMin && precioMax && precioMax < precioMin) {
      this.filterForm.patchValue({
        precioMax: precioMin
      });
    }
  }

  limpiarFiltros() {
    this.filterForm.reset();
    this.filteredProductosConImagenes = [...this.productosConImagenes];
    this.totalItems = this.filteredProductosConImagenes.length;
    this.pageChanged({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  crearProducto(template: TemplateRef<any>)
  {
    this.titleModal="NUEVO PRODUCTO";
    this.productoSelected=new ProductoResponse();
    this.imagenSelected=new ImagenResponse();
    this.accionModal=AccionMantConst.crear;
    this.openModal(template);
  }

  editarProducto(template: TemplateRef<any>,producto:ProductoResponse, imagen:ImagenResponse) {
    this.titleModal="EDITAR PRODUCTO";
    this.accionModal=AccionMantConst.editar;
    this.productoSelected = producto;
    this.imagenSelected = imagen;
    this.openModal(template);
  }

  eliminarProducto(id : number) {
     alert_confirm_delete('¿Estás seguro?', '¡Esta acción es irreversible!').then((result) => {
        if (result.isConfirmed) {
            this._productoService.delete(id).subscribe({
                next: (data: number) => {
                  alert_delete_success("Registro eliminado", "El registro se ha eliminado correctamente.");
                  this.listarProductos()
                },
               error: (error) => {
                // Verificar si el error tiene la estructura esperada
                if (error && error.error && error.error.mensaje) {
                  alert_delete_error("Error",  "Este producto está siendo utilizado por otros registros de ventas y no puede ser eliminado.");
                } else {
                  alert_delete_error("Error", "Ocurrió un error al eliminar el registro.");
                }
              }
            });
        }
    });
  }


  obternerListas(){
    forkJoin([
      this._categoriaService.getAll(),
      this._tipoProductoService.getAll(),
      // this._tipoFundaService.getAll(),
      // this._tipoProtectorService.getAll(),
    ]).subscribe({
      next:(data:any)=>{
        this.categorias = data[0]
        this.tipoProductos = data[1]
        // this.tipoFundas = data[1]
        // this.tipoProtectores = data[2]
      },
      error:(err)=>{},
      complete:() => {},
    });
  }
  
  getCategoriaName(idCategoria: number): string {
  const categoria = this.categorias.find(c => c.idCategoria === idCategoria);
  return categoria ? categoria.nombre : 'Sin Categoria';
  }

  // getTipoFundaName(idTipoFunda: number): string{
  //   if (!idTipoFunda) return 'N/A';
  //   const tipoFunda = this.tipoFundas.find(tf => tf.idTipoFunda === idTipoFunda);
  //   return tipoFunda ? tipoFunda.nombre : 'Sin tipo';
  // }

  // getTipoProtectorName(idTipoProtector: number): string {
  //   if (!idTipoProtector) return 'N/A';
  //   const tipoProtector = this.tipoProtectores.find(tp => tp.idTipoProtector === idTipoProtector);
  //   return tipoProtector ? tipoProtector.nombre : 'Sin tipo';
  // }

  getTipoProductorName(idTipoProducto: number): string {
    if (!idTipoProducto) return 'N/A';
    const tipoProducto = this.tipoProductos.find(tp => tp.idTipoProducto === idTipoProducto);
    return tipoProducto ? tipoProducto.nombre : 'Sin tipo';
  }
  

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  
  getCloseModalEmmit(res:boolean)
  {
    this.modalRef?.hide();
    if (res){
      this.listarProductos();
    }
  }

}
