import { Component, OnInit, TemplateRef } from '@angular/core';
import { ImagenResponse } from '../../../models/imagen-response.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ImagenService } from '../../../service/imagen.service';
import { AccionMantConst } from 'src/app/constans/general.constans';

@Component({
  selector: 'app-mant-imagen-list',
  templateUrl: './mant-imagen-list.component.html',
  styleUrls: ['./mant-imagen-list.component.scss']
})
export class MantImagenListComponent implements OnInit{

  imagenes:ImagenResponse[]=[];
  modalRef?: BsModalRef;
  imagenSelected: ImagenResponse=new ImagenResponse();
  titleModal:string="";
  accionModal:number=0;

  constructor(
    private _route:Router,
    private modalService: BsModalService,
    private _iamgenService:ImagenService 
  )
  {

  }



  // PRIMER EVENTO QUE EJECUTA EL COMPONENTE
  ngOnInit(): void {

    this.listarImagenes();
    
  }

  listarImagenes()
  {
    this._iamgenService.getAll().subscribe({
      next:(data:ImagenResponse[])=>{
        this.imagenes=data
        console.log("imagenes",data);
      },
      error:(err)=>{
        console.log("error",err);
      },
      complete:()=>{
        //falta
      },
    });
  }


  crearImagen(template: TemplateRef<any>)
  {
    this.titleModal="NUEVA IMAGEN";
    this.imagenSelected=new ImagenResponse();
    this.accionModal=AccionMantConst.crear;
    this.openModal(template);
  }

  editarImagen(template: TemplateRef<any>,imagen:ImagenResponse)
  { 
    this.imagenSelected=imagen;
    this.titleModal="MODIFICAR imagen";
    this.accionModal=AccionMantConst.editar;
    this.openModal(template);
  }

  

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  getCloseModalEmmit(res:boolean)
  {
    this.modalRef?.hide();
    if (res){
      this.listarImagenes();
    }
  }

  eliminarRegistro(id:number)
  {
    let result = confirm("¿Estas seguro de eliminar el registro?");
     
    if(result)
    {
      this._iamgenService.delete(id).subscribe({
        next:(data:number)=>{
          alert("Registro eliminado de forma correcta");
        },
        error:()=>{},
        complete:()=>{
          this.listarImagenes();
        },
      })
    }
  }


}
