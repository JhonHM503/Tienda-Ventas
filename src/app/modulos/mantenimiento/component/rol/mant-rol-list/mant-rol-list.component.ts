import { Component, OnInit, TemplateRef } from '@angular/core';
import { RolResponse } from '../../../models/rol-response.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { RolService } from '../../../service/rol.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { alert_confirm_delete, alert_delete_error, alert_delete_success } from 'src/app/functions/general.functions';

@Component({
  selector: 'app-mant-rol-list',
  templateUrl: './mant-rol-list.component.html',
  styleUrls: ['./mant-rol-list.component.scss']
})
export class MantRolListComponent implements OnInit {

  roles:RolResponse[]=[];
  modalRef?: BsModalRef;
  rolSelected: RolResponse=new RolResponse();
  titleModal:string="";
  accionModal:number=0;

  constructor(
    private _route:Router,
    private modalService: BsModalService,
    private _rolService:RolService 
  )
  {

  }



  // PRIMER EVENTO QUE EJECUTA EL COMPONENTE
  ngOnInit(): void {

    this.listarRoles();
    
  }

  listarRoles()
  {
    this._rolService.getAll().subscribe({
      next:(data:RolResponse[])=>{
        this.roles=data
        console.log("roles",data);
      },
      error:(err)=>{
        console.log("error",err);
      },
      complete:()=>{
        //falta
      },
    });
  }


  crearRoles(template: TemplateRef<any>)
  {
    this.titleModal="NUEVO ROL";
    this.rolSelected=new RolResponse();
    this.accionModal=AccionMantConst.crear;
    this.openModal(template);
  }

  editarRoles(template: TemplateRef<any>,rol:RolResponse)
  { 
    this.rolSelected=rol;
    this.titleModal="MODIFICAR ROLES";
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
      this.listarRoles();
    }
  }

 eliminarRegistro(id: number) {
    alert_confirm_delete('¿Estás seguro?', '¡Esta acción es irreversible!').then((result) => {
      if (result.isConfirmed) {
        this._rolService.delete(id).subscribe({
          next: (data: number) => {
            alert_delete_success("Registro eliminado", "El registro se ha eliminado correctamente.");
            this.listarRoles();
          },
          error: (error) => {
            if (error.status === 500) {
              // Asumimos que el error 500 es debido a una violación de clave foránea
              alert_delete_error("No se puede eliminar", "Este rol está siendo utilizado por otros registros y no puede ser eliminado.");
            } else {
              alert_delete_error("Error", "Ocurrió un error al eliminar el registro.");
            }
          }
        });
      }
    });
  }


}
