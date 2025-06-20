import { Component, OnInit, TemplateRef } from '@angular/core';
import { PersonaResponse } from '../../../models/persona-response.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { PersonaService } from '../../../service/persona.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { VPersona } from '../../../models/VPersona.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-mant-persona-list',
  templateUrl: './mant-persona-list.component.html',
  styleUrls: ['./mant-persona-list.component.scss']
})
export class MantPersonaListComponent implements OnInit {

  config ={
    backdrop:true,
    ignoreBackdropClick:true
  };

  genericFilterRequest: GenericFilterRequest = new GenericFilterRequest();
  vPersonas: VPersona[] = [];

  personas:PersonaResponse[]=[];
  modalRef?: BsModalRef;
  personaSelected: VPersona=new VPersona();
  titleModal:string="";
  accionModal = AccionMantConst.editar;

  myFormFilter:FormGroup; 
  totalItems:number=0;
  itemsPerPage:number = 5;
  request: GenericFilterRequest = new GenericFilterRequest();

  constructor(
    private _route:Router,
     private fb: FormBuilder,
    private modalService: BsModalService,
    private _personaService:PersonaService 
  )
  {
      this.myFormFilter=this.fb.group({

      fechaReserva:["",[]],
      nombreServicio:["",[]],

    });

  }



  // PRIMER EVENTO QUE EJECUTA EL COMPONENTE
  ngOnInit(): void {

    this.filtrar();
    
  }

  listarPersonas()
  {
    this._personaService.genericFilterView(this.genericFilterRequest).subscribe({
      next:(data:GenericFilterResponse<VPersona>)=>{
        this.vPersonas=data.lista
        console.log("personas",data);
      },
      error:(err)=>{
        console.log("error",err);
      },
      complete:()=>{
        //falta
      },
    });
  }


  crearPersona(template: TemplateRef<any>)
  {
    this.titleModal="NUEVO PERSONA";
    this.personaSelected=new VPersona();
    this.accionModal=AccionMantConst.crear;
    this.openModal(template);
  }

  editarPersona(template: TemplateRef<any>,persona:VPersona)
  { 
    this.personaSelected=persona;
    this.titleModal="MODIFICAR PERSONA";
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
      this.listarPersonas();
    }
  }

   filtrar()
  {
    let valueForm = this.myFormFilter.getRawValue();

    this.request.filtros.push({name:"fechaReserva",value: valueForm.fechaReserva});
    this.request.filtros.push({name:"nombreServicio",value: valueForm.nombreServicio});

    

    this._personaService.genericFilterView(this.request).subscribe({
      next:(data: GenericFilterResponse<VPersona>)=>{
        console.log(data);
        this.vPersonas = data.lista;
        this.totalItems = data.totalRegistros;
      },
      error:()=>{
        console.log("error")
      },
      complete:()=>{
        console.log("completo")
      },
    })

  }

   changePage(event: PageChangedEvent){
    this.request.numeroPagina = event.page; 
    console.log(event.page)
    this.filtrar();
  }

  changeItemsPerPage()
  {
    this.request.cantidad = this.itemsPerPage;
    this.filtrar();
  }

  eliminarRegistro(id:number)
  {
    let result = confirm("¿Estas seguro de eliminar el registro?");
     
    if(result)
    {
      this._personaService.delete(id).subscribe({
        next:(data:number)=>{
          alert("Registro eliminado de forma correcta");
        },
        error:()=>{},
        complete:()=>{
          this.listarPersonas();
        },
      })
    }
  }


}
