import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RolResponse } from '../../../models/rol-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolRequest } from '../../../models/rol-request.model';
import { RolService } from '../../../service/rol.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { alert_success } from 'src/app/functions/general.functions';

@Component({
  selector: 'app-mant-rol-register',
  templateUrl: './mant-rol-register.component.html',
  styleUrls: ['./mant-rol-register.component.scss']
})
export class MantRolRegisterComponent implements OnInit {

  // Declarando variables de entrada
  @Input() title:string="";
  @Input() rol:RolResponse= new RolResponse();
  @Input() accion: number = 0;

    // Declarando variables de SALI
  @Output() closeModalEmmit = new EventEmitter<boolean>();


  // Declarando variables de internas
  myForm:FormGroup;
  rolEnvio:RolRequest = new RolRequest();

  //delcaramos el constructor
  constructor(
    private fb: FormBuilder,
    private _rolService: RolService,
  )
  {
    //nuestro formulario cargo request
    this.myForm=this.fb.group({

      idRol:[{value:0,disable:true},[Validators.required]],
      nombre:[null,[Validators.required]],

    })
  } 


  ngOnInit(): void {
    console.log("title ==> ", this.title);
    console.log("title ==> ", this.rol);
    
    this.myForm.patchValue(this.rol);
  }

  guardar()
  {
    this.rolEnvio = this.myForm.getRawValue()
    
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
    this._rolService.create(this.rolEnvio).subscribe({
      next:(data:RolResponse)=>{
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
    this._rolService.update(this.rolEnvio).subscribe({
      next:(data:RolResponse)=>{
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
