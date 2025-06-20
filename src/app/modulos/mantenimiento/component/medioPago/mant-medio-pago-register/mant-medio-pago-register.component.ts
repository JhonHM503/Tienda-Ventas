import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MetodoPagoResponse } from '../../../models/metodoPago-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MetodoPagoRequest } from '../../../models/metodoPago-request.model';
import { MetodoPagoService } from '../../../service/metodo-pago.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { alert_success } from 'src/app/functions/general.functions';

@Component({
  selector: 'app-mant-medio-pago-register',
  templateUrl: './mant-medio-pago-register.component.html',
  styleUrls: ['./mant-medio-pago-register.component.scss']
})
export class MantMedioPagoRegisterComponent {
 // Declarando variables de entrada
  @Input() title:string="";
  @Input() metodoPago:MetodoPagoResponse= new MetodoPagoResponse();
  @Input() accion: number = 0;

    // Declarando variables de SALI
  @Output() closeModalEmmit = new EventEmitter<boolean>();


  // Declarando variables de internas
  myForm:FormGroup;
  metodoPagoEnvio:MetodoPagoRequest = new MetodoPagoRequest();

  //delcaramos el constructor
  constructor(
    private fb: FormBuilder,
    private _metodoPagoService: MetodoPagoService,
  )
  {
    //nuestro formulario cargo request
    this.myForm=this.fb.group({

      idMetodoPago:[{value:0,disable:true},[Validators.required]],
      nombre:[null,[Validators.required]],

    })
  } 


  ngOnInit(): void {
    console.log("title ==> ", this.title);
    console.log("title ==> ", this.metodoPago);
    
    this.myForm.patchValue(this.metodoPago);
  }

  guardar()
  {
    this.metodoPagoEnvio = this.myForm.getRawValue()
    
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
    this._metodoPagoService.create(this.metodoPagoEnvio).subscribe({
      next:(data:MetodoPagoResponse)=>{
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
    this._metodoPagoService.update(this.metodoPagoEnvio).subscribe({
      next:(data:MetodoPagoResponse)=>{
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
