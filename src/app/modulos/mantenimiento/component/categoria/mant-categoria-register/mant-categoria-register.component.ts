import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriaResponse } from '../../../models/categoria-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaRequest } from '../../../models/categoria-request.model';
import { CategoriaService } from '../../../service/categoria.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { alert_success } from 'src/app/functions/general.functions';

@Component({
  selector: 'app-mant-categoria-register',
  standalone: false,
  // imports: [],
  templateUrl: './mant-categoria-register.component.html',
  styleUrl: './mant-categoria-register.component.scss'
})
export class MantCategoriaRegisterComponent implements OnInit {

// Declarando variables de entrada
  @Input() title:string="";
  @Input() categoria:CategoriaResponse= new CategoriaResponse();
  @Input() accion: number = 0;

    // Declarando variables de SALI
  @Output() closeModalEmmit = new EventEmitter<boolean>();


  // Declarando variables de internas
  myForm:FormGroup;
  categoriaEnvio:CategoriaRequest = new CategoriaRequest();

  //delcaramos el constructor
  constructor(
    private fb: FormBuilder,
    private _categoriaService: CategoriaService,
  )
  {
    //nuestro formulario cargo request
    this.myForm=this.fb.group({

      idCategoria:[{value:0,disable:true},[Validators.required]],
      nombre:[null,[Validators.required]],

    })
  } 


  ngOnInit(): void {
    console.log("title ==> ", this.title);
    console.log("title ==> ", this.categoria);
    
    this.myForm.patchValue(this.categoria);
  }

  guardar()
  {
    this.categoriaEnvio= this.myForm.getRawValue()
    
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
    this._categoriaService.create(this.categoriaEnvio).subscribe({
      next:(data:CategoriaResponse)=>{
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
    this._categoriaService.update(this.categoriaEnvio).subscribe({
      next:(data:CategoriaResponse)=>{
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
 
