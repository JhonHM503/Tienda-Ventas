import { Component, TemplateRef } from '@angular/core';
import { MetodoPagoResponse } from '../../../models/metodoPago-response.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { RolService } from '../../../service/rol.service';
import { MetodoPagoService } from '../../../service/metodo-pago.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { alert_confirm_delete, alert_delete_error, alert_delete_success } from 'src/app/functions/general.functions';

@Component({
  selector: 'app-mant-medio-pago-list',
  templateUrl: './mant-medio-pago-list.component.html',
  styleUrls: ['./mant-medio-pago-list.component.scss']
})
export class MantMedioPagoListComponent {
  metodoPagos:MetodoPagoResponse[]=[];
  modalRef?: BsModalRef;
  metodoPagoSelected: MetodoPagoResponse=new MetodoPagoResponse();
  titleModal:string="";
  accionModal:number=0;

  constructor(
    private _route:Router,
    private modalService: BsModalService,
    private _metodoPagoService:MetodoPagoService 
  )
  {

  }



  // PRIMER EVENTO QUE EJECUTA EL COMPONENTE
  ngOnInit(): void {

    this.listarMetodoPago();
    
  }

  listarMetodoPago()
  {
    this._metodoPagoService.getAll().subscribe({
      next:(data:MetodoPagoResponse[])=>{
        this.metodoPagos=data
        console.log("metodoPago",data);
      },
      error:(err)=>{
        console.log("error",err);
      },
      complete:()=>{
        //falta
      },
    });
  }


  crearMetodoPago(template: TemplateRef<any>)
  {
    this.titleModal="NUEVO METODO DE PAGO";
    this.metodoPagoSelected=new MetodoPagoResponse();
    this.accionModal=AccionMantConst.crear;
    this.openModal(template);
  }

  editarMetodoPago(template: TemplateRef<any>,rol:MetodoPagoResponse)
  { 
    this.metodoPagoSelected=rol;
    this.titleModal="MODIFICAR METODO PAGO";
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
      this.listarMetodoPago();
    }
  }

 eliminarRegistro(id: number) {
    alert_confirm_delete('¿Estás seguro?', '¡Esta acción es irreversible!').then((result) => {
      if (result.isConfirmed) {
        this._metodoPagoService.delete(id).subscribe({
          next: (data: number) => {
            alert_delete_success("Registro eliminado", "El registro se ha eliminado correctamente.");
            this.listarMetodoPago();
          },
          error: (error) => {
            if (error.status === 500) {
              // Asumimos que el error 500 es debido a una violación de clave foránea
              alert_delete_error("No se puede eliminar", "Este Metodo de Pago está siendo utilizado por otros registros y no puede ser eliminado.");
            } else {
              alert_delete_error("Error", "Ocurrió un error al eliminar el registro.");
            }
          }
        });
      }
    });
  }
}
