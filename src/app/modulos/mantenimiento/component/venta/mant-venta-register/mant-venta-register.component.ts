import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { alert_error, alert_success } from 'src/app/functions/general.functions';
import { VentaResponse } from '../../../models/venta-response.model';
import { DetalleVentaResponse } from '../../../models/datalleVenta-response.model';
import { VentaRequest } from '../../../models/venta-request.model';
import { DetalleVentaRequest } from '../../../models/datalleVenta-request.model';
import { VentaService } from '../../../service/venta.service';
import { DetalleVentaService } from '../../../service/detalle-venta.service';
import { AccionMantConst } from 'src/app/constans/general.constans';

@Component({
  selector: 'app-mant-venta-register',
  standalone: false,
  // imports: [],
  templateUrl: './mant-venta-register.component.html',
  styleUrl: './mant-venta-register.component.scss'
})
export class MantVentaRegisterComponent implements OnInit {
  
  // Declarando variables de entrada
  @Input() title:string="";
  @Input() venta:VentaResponse= new VentaResponse();
  @Input() accion: number = 0;

    // Declarando variables de SALI
  @Output() closeModalEmmit = new EventEmitter<boolean>();


  // Declarando variables de internas
  myForm:FormGroup;
  ventaEnvio:VentaRequest = new VentaRequest();

  //delcaramos el constructor
  constructor(
    private fb: FormBuilder,
    private _ventaService: VentaService,
  )
  {
    //nuestro formulario cargo request
    this.myForm=this.fb.group({

      idVenta:[{value:0,disable:true},[Validators.required]],
      idUsuario:[{value:0,disable:true}],
      idMetodoPago:[{value:0,disable:true}],
      total:[null,[Validators.required]],
      idCliente:[{value:0,disable:true}],
      
    })
  } 


  ngOnInit(): void {
    console.log("title ==> ", this.title);
    console.log("title ==> ", this.venta);
    
    this.myForm.patchValue(this.venta);
  }

  guardar()
  {
    this.ventaEnvio= this.myForm.getRawValue()
    
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
    this._ventaService.create(this.ventaEnvio).subscribe({
      next:(data:VentaResponse)=>{
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
    this._ventaService.update(this.ventaEnvio).subscribe({
      next:(data:VentaResponse)=>{
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
