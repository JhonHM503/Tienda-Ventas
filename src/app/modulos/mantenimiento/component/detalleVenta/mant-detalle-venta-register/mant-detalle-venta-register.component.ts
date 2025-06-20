import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DetalleVentaResponse } from '../../../models/datalleVenta-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleVentaRequest } from '../../../models/datalleVenta-request.model';
import { DetalleVentaService } from '../../../service/detalle-venta.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { alert_success } from 'src/app/functions/general.functions';

@Component({
  selector: 'app-mant-detalle-venta-register',
  standalone: false,
  // imports: [],
  templateUrl: './mant-detalle-venta-register.component.html',
  styleUrl: './mant-detalle-venta-register.component.scss'
})
export class MantDetalleVentaRegisterComponent implements OnInit {
  // Declarando variables de entrada
  @Input() title:string="";
  @Input() detalleVenta:DetalleVentaResponse= new DetalleVentaResponse();
  @Input() accion: number = 0;

    // Declarando variables de SALI
  @Output() closeModalEmmit = new EventEmitter<boolean>();


  // Declarando variables de internas
  myForm:FormGroup;
  detalleVentaEnvio:DetalleVentaRequest = new DetalleVentaRequest();

  //delcaramos el constructor
  constructor(
    private fb: FormBuilder,
    private _detalleVentaService: DetalleVentaService,
  )
  {
    //nuestro formulario cargo request
    this.myForm=this.fb.group({

      idDetalleVenta:[{value:0,disable:true}],
      idUsuario:[{value:0,disable:true}],
      idMetodoPago:[{value:0,disable:true}],
      fechaDetalleVenta:[null],
      total:[null,[Validators.required]],
    })
  } 


  ngOnInit(): void {
    console.log("title ==> ", this.title);
    console.log("title ==> ", this.detalleVenta);
    
    this.myForm.patchValue(this.detalleVenta);
  }

  guardar()
  {
    this.detalleVentaEnvio= this.myForm.getRawValue()
    
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
    this._detalleVentaService.create(this.detalleVentaEnvio).subscribe({
      next:(data:DetalleVentaResponse)=>{
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
    this._detalleVentaService.update(this.detalleVentaEnvio).subscribe({
      next:(data:DetalleVentaResponse)=>{
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
