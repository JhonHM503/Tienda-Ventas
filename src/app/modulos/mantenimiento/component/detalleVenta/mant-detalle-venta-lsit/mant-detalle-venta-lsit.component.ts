import { Component, OnInit, TemplateRef } from '@angular/core';
import { DetalleVentaResponse } from '../../../models/datalleVenta-response.model';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DetalleVentaService } from '../../../service/detalle-venta.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { alert_confirm_delete, alert_delete_error, alert_delete_success } from 'src/app/functions/general.functions';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-mant-detalle-venta-lsit',
  standalone: false,
  // imports: [],
  templateUrl: './mant-detalle-venta-lsit.component.html',
  styleUrl: './mant-detalle-venta-lsit.component.scss'
})
export class MantDetalleVentaLsitComponent implements OnInit {
  
  detalleVentas:DetalleVentaResponse[]=[];
  modalRef?: BsModalRef;
  detalleVentaSelected: DetalleVentaResponse=new DetalleVentaResponse();
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
    private _detalleVentasService:DetalleVentaService 
  )
  {
    //nuestro formulario cargo request
    this.myFormFilter=this.fb.group({

      nombre:["",[]],

    });

  }


  // PRIMER EVENTO QUE EJECUTA EL COMPONENTE
  ngOnInit(): void {

    this.listarDetalleVentas();
    
  }

  listarDetalleVentas()
  {
    this._detalleVentasService.getAll().subscribe({
      next:(data:DetalleVentaResponse[])=>{
        this.detalleVentas=data
        console.log("detalleDetalleVentas",data);
      },
      error:(err)=>{
        console.log("error",err);
      },
      complete:()=>{
        //falta
      },
    });
  }


  crearDetalleVenta(template: TemplateRef<any>)
  {
    this.titleModal="NUEVA VENTA";
    this.detalleVentaSelected=new DetalleVentaResponse();
    this.accionModal=AccionMantConst.crear;
    this.openModal(template);
  }

  editarDetalleVenta(template: TemplateRef<any>,cargo:DetalleVentaResponse)
  { 
    this.detalleVentaSelected=cargo;
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
      this.listarDetalleVentas();
    }
  }

  
  eliminarRegistro(id:number)
  {
    alert_confirm_delete('¿Estás seguro?', '¡Esta acción es irreversible!').then((result) => {
        if (result.isConfirmed) {
            this._detalleVentasService.delete(id).subscribe({
                next: (data: number) => {
                    alert_delete_success("Registro eliminado", "El registro se ha eliminado correctamente.");
                },
                error: () => {
                    alert_delete_error("Error", "Ocurrió un error al eliminar el registro.");
                },
                complete: () => {
                    this.listarDetalleVentas();
                },
            });
        }
    });
  }



  changePage(event: PageChangedEvent){
    this.request.numeroPagina = event.page;
    this.listarDetalleVentas();
  }

  changeItemsPerPage()
  {
    this.request.cantidad = this.itemsPerPage;
    this.listarDetalleVentas();
  }

}
