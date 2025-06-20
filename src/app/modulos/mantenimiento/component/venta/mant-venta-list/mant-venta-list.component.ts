import { Component, OnInit, TemplateRef } from '@angular/core';
import { VentaResponse } from '../../../models/venta-response.model';
import { DetalleVentaResponse } from '../../../models/datalleVenta-response.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VentaService } from '../../../service/venta.service';
import { DetalleVentaService } from '../../../service/detalle-venta.service';
import { forkJoin } from 'rxjs';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { alert_confirm_delete, alert_delete_error, alert_delete_success } from 'src/app/functions/general.functions';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';

@Component({
  selector: 'app-mant-venta-list',
  standalone: false,
  // imports: [],
  templateUrl: './mant-venta-list.component.html',
  styleUrl: './mant-venta-list.component.scss'
})
export class MantVentaListComponent implements OnInit {
  ventas:VentaResponse[]=[];
  modalRef?: BsModalRef;
  ventaSelected: VentaResponse=new VentaResponse();
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
    private _ventasService:VentaService 
  )
  {
    //nuestro formulario cargo request
    this.myFormFilter=this.fb.group({

      nombre:["",[]],

    });

  }


  // PRIMER EVENTO QUE EJECUTA EL COMPONENTE
  ngOnInit(): void {

    this.listarVentas();
    
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


  crearVenta(template: TemplateRef<any>)
  {
    this.titleModal="NUEVA VENTA";
    this.ventaSelected=new VentaResponse();
    this.accionModal=AccionMantConst.crear;
    this.openModal(template);
  }

  editarVenta(template: TemplateRef<any>,cargo:VentaResponse)
  { 
    this.ventaSelected=cargo;
    this.titleModal="MODIFICAR VENTA";
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
      this.listarVentas();
    }
  }

  
  eliminarRegistro(id:number)
  {
    alert_confirm_delete('¿Estás seguro?', '¡Esta acción es irreversible!').then((result) => {
        if (result.isConfirmed) {
            this._ventasService.delete(id).subscribe({
                next: (data: number) => {
                    alert_delete_success("Registro eliminado", "El registro se ha eliminado correctamente.");
                },
                error: () => {
                    alert_delete_error("Error", "Ocurrió un error al eliminar el registro.");
                },
                complete: () => {
                    this.listarVentas();
                },
            });
        }
    });
  }



  changePage(event: PageChangedEvent){
    this.request.numeroPagina = event.page;
    this.listarVentas();
  }

  changeItemsPerPage()
  {
    this.request.cantidad = this.itemsPerPage;
    this.listarVentas();
  }

}
