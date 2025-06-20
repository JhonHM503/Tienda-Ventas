import { Component, OnInit, TemplateRef } from '@angular/core';
import { CategoriaResponse } from '../../../models/categoria-response.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../service/categoria.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { alert_confirm_delete, alert_delete_error, alert_delete_success } from 'src/app/functions/general.functions';

@Component({
  selector: 'app-mant-categoria-list',
  standalone: false,
  // imports: [],
  templateUrl: './mant-categoria-list.component.html',
  styleUrl: './mant-categoria-list.component.scss'
})
export class MantCategoriaListComponent implements OnInit {
  categorias:CategoriaResponse[]=[];
  modalRef?: BsModalRef;
  categoriaSelected: CategoriaResponse=new CategoriaResponse();
  titleModal:string="";
  accionModal:number=0;
  myFormFilter: FormGroup;
  totalItems:number=0;
  itemsPerPage:number = 3;
  request: GenericFilterRequest = new GenericFilterRequest();

  constructor(
    private _route:Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private _categoriasService:CategoriaService 
  )
  {
    //nuestro formulario cargo request
    this.myFormFilter=this.fb.group({

      nombre:["",[]],

    });

  }



  // PRIMER EVENTO QUE EJECUTA EL COMPONENTE
  ngOnInit(): void {

    this.listarCategorias();
    
  }

  listarCategorias()
  {
    this._categoriasService.getAll().subscribe({
      next:(data:CategoriaResponse[])=>{
        this.categorias=data
        console.log("cargos",data);
      },
      error:(err)=>{
        console.log("error",err);
      },
      complete:()=>{
        //falta
      },
    });
  }


  crearCargo(template: TemplateRef<any>)
  {
    this.titleModal="NUEVA CATEGORIA";
    this.categoriaSelected=new CategoriaResponse();
    this.accionModal=AccionMantConst.crear;
    this.openModal(template);
  }

  editarCargo(template: TemplateRef<any>,cargo:CategoriaResponse)
  { 
    this.categoriaSelected=cargo;
    this.titleModal="MODIFICAR CATEGORIA";
    this.accionModal=AccionMantConst.editar;
    this.openModal(template);
  }

  

config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: "gray modal-l" }, this.config));

  }


  getCloseModalEmmit(res:boolean)
  {
    this.modalRef?.hide();
    if (res){
      this.listarCategorias();
    }
  }

  eliminarRegistro(id:number)
  {
    alert_confirm_delete('¿Estás seguro?', '¡Esta acción es irreversible!').then((result) => {
        if (result.isConfirmed) {
            this._categoriasService.delete(id).subscribe({
                next: (data: number) => {
                    alert_delete_success("Registro eliminado", "El registro se ha eliminado correctamente.");
                },
                error: () => {
                    alert_delete_error("Error", "Ocurrió un error al eliminar el registro.");
                },
                complete: () => {
                    this.listarCategorias();
                },
            });
        }
    });
  }

  // filtrar()
  // {
  //   let valueForm = this.myFormFilter.getRawValue();

  //   this.request.filtros.push({name:"nombre",value: valueForm.nombreCargo});

  //   this._categoriasService.genericFilter(this.request).subscribe({
  //     next:(data: GenericFilterResponse<CategoriaResponse>)=>{
  //       console.log(data);
  //       this.categorias = data.lista;
  //       this.totalItems = data.totalRegistros;
  //     },
  //     error:()=>{
  //       console.log("error")
  //     },
  //     complete:()=>{
  //       console.log("completo")
  //     },
  //   })

  // }

  changePage(event: PageChangedEvent){
    this.request.numeroPagina = event.page;
    this.listarCategorias();
  }

  changeItemsPerPage()
  {
    this.request.cantidad = this.itemsPerPage;
    this.listarCategorias();
  }

}

