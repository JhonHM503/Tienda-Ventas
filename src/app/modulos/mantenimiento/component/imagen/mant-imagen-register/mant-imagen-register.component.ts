import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImagenResponse } from '../../../models/imagen-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagenRequest } from '../../../models/imagen-request.model';
import { ImagenService } from '../../../service/imagen.service';
import { AccionMantConst } from 'src/app/constans/general.constans';

@Component({
  selector: 'app-mant-imagen-register',
  templateUrl: './mant-imagen-register.component.html',
  styleUrls: ['./mant-imagen-register.component.scss']
})
export class MantImagenRegisterComponent implements OnInit {

   // Declarando variables de entrada
  @Input() title:string="";
  @Input() imagen:ImagenResponse= new ImagenResponse();
  @Input() accion: number = 0;

    // Declarando variables de SALI
  @Output() closeModalEmmit = new EventEmitter<boolean>();

  // Declarando variables de internas
  myForm:FormGroup;
  imagenEnvio:ImagenRequest = new ImagenRequest();

  //delcaramos el constructor
  constructor(
    private fb: FormBuilder,
    private _imagenService: ImagenService,
  )
  {
    //nuestro formulario cargo request
    this.myForm=this.fb.group({

      idImagen:[{value:0,disable:true},[Validators.required]],
      idPersona:[{value:0,disable:true},[Validators.required]],
      idServicio:[{value:0,disable:true},[Validators.required]],
      nombreImagen:[null,[Validators.required]],
      rutaImagen:[null,[Validators.required]],

    })
  } 

  ngOnInit(): void {
    console.log("title ==> ", this.title);
    console.log("title ==> ", this.imagen);
    
    this.myForm.patchValue(this.imagen);
  }

  guardar()
  {
    this.imagenEnvio = this.myForm.getRawValue()
    
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
    this._imagenService.create(this.imagenEnvio).subscribe({
      next:(data:ImagenResponse)=>{
        alert("Creado de forma correcta");
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
    this._imagenService.update(this.imagenEnvio).subscribe({
      next:(data:ImagenResponse)=>{
        alert("actualizado de forma correcta");
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
