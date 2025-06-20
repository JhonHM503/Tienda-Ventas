import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipoDocumentoResponse } from '../../../models/tipoDocumento-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TipoDocumentoService } from '../../../service/tipo-documento.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { TipoDocumentoRequest } from '../../../models/tipoDocumento-request.model';
import { alert_success } from 'src/app/functions/general.functions';


@Component({
  selector: 'app-mant-tipo-documento-register',
  templateUrl: './mant-tipo-documento-register.component.html',
  styleUrls: ['./mant-tipo-documento-register.component.scss']
})
export class MantTipoDocumentoRegisterComponent implements OnInit {

   // Declarando variables de entrada
  @Input() title:string="";
  @Input() tipoDocumento:TipoDocumentoResponse= new TipoDocumentoResponse();
  @Input() accion: number = 0;

    // Declarando variables de SALI
  @Output() closeModalEmmit = new EventEmitter<boolean>();


  // Declarando variables de internas
  myForm:FormGroup;
  tipoDocumentoEnvio:TipoDocumentoRequest = new TipoDocumentoRequest();

  //delcaramos el constructor
  constructor(
    private fb: FormBuilder,
    private _tipoDocumentoService: TipoDocumentoService,
  )
  {
    //nuestro formulario cargo request
    this.myForm=this.fb.group({

      idTipoDocumento:[{value:0,disable:true},[Validators.required]],
      nombre:[null,[Validators.required]],
    })
  } 

  ngOnInit(): void {
    console.log("title ==> ", this.title);
    console.log("title ==> ", this.tipoDocumento);
    
    this.myForm.patchValue(this.tipoDocumento);
  }

  guardar()
  {
    this.tipoDocumentoEnvio = this.myForm.getRawValue()
    
    switch(this.accion){
      case AccionMantConst.crear:
        //crear un nuevo egistro
        this.crearRegistro();
        break;
      case AccionMantConst.editar:
        //inactivar
        this.editarRegistro();
        break;
      case AccionMantConst.eliminar:
        //eliminar registro
        break;
    }
  }

  crearRegistro(){
    //llamar al servicio rest ==> permitire crear un nuevo registro en base de datos
    this._tipoDocumentoService.create(this.tipoDocumentoEnvio).subscribe({
      next:(data:TipoDocumentoResponse)=>{
        alert_success("Registro creado", "El registro se ha creado correctamente.");
      },
      error:()=>{
          alert("Ocurrio un error");
      },
      complete:()=>{
        this.cerrarModal(true);
      },
    })
  }

  editarRegistro(){
    this._tipoDocumentoService.update(this.tipoDocumentoEnvio).subscribe({
      next:(data:TipoDocumentoResponse)=>{
        alert_success("Registro actualizado", "El registro se ha actualizado correctamente.");
      },
      error:()=>{
          alert("Ocurrio un error");
      },
      complete:()=>{
        this.cerrarModal(true);
      },
    })

  }

  cerrarModal(res:boolean)
  {
    //true ==> hubo modificacion en la base de datos
    //false ==> NO hubo modificacion en la base de datos
    this.closeModalEmmit.emit(res);
  }

}
