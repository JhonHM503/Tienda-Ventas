import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonaResponse } from '../../../models/persona-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaRequest } from '../../../models/persona-request.model';
import { PersonaService } from '../../../service/persona.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { TipoDocumentoResponse } from '../../../models/tipoDocumento-response.model';
import { TipoDocumentoService } from '../../../service/tipo-documento.service';

@Component({
  selector: 'app-mant-persona-register',
  templateUrl: './mant-persona-register.component.html',
  styleUrls: ['./mant-persona-register.component.scss']
})
export class MantPersonaRegisterComponent implements OnInit {

  // Declarando variables de entrada
  @Input() title:string="";
  @Input() persona:PersonaResponse= new PersonaResponse();
  @Input() accion: number = 0;

    // Declarando variables de SALI
  @Output() closeModalEmmit = new EventEmitter<boolean>();


  // Declarando variables de internas
  myForm:FormGroup;
  personaEnvio:PersonaRequest = new PersonaRequest();
  
  tipoDocumento:TipoDocumentoResponse[]=[];

  //delcaramos el constructor
  constructor(
    private fb: FormBuilder,
    private _personaService: PersonaService,
    private _tipoDocumentoService: TipoDocumentoService,
  )
  {
    //nuestro formulario cargo request
    this.myForm=this.fb.group({

      idPersona:[{value:0,disable:true},[Validators.required]],
      nombrePersona:[null,[Validators.required]],
      apPaternoPersona:[null,[Validators.required]],
      apMaternoPersona:[null,[Validators.required]],
      idTipoDocumento:[null,[Validators.required]],
      numeroDocumento:[null,[Validators.required]],

    })
  } 



  ngOnInit(): void {
    console.log("title ==> ", this.title);
    console.log("title ==> ", this.persona);
    

    this.obtenerTDocs();
    this.myForm.patchValue(this.persona);
    this.buscarDNI();
    
  }

  guardar()
  {
    this.personaEnvio = this.myForm.getRawValue()
    
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
    this._personaService.create(this.personaEnvio).subscribe({
      next:(data:PersonaResponse)=>{
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

  // buscarDNI(){
  //   var dni = "72251043";
  //   this._personaService.buscarDNI(dni).subscribe({
  //     next:(data:PersonaResponse)=>
  //       {
  //         console.log(data);
  //       },
  //     error:()=>{},
  //     complete:()=>{}
  //   })
  // }
  buscarDNI() {
  const dni = this.myForm.get('numeroDocumento')?.value;
  if (dni) {
    this._personaService.buscarDNI(dni).subscribe({
      next: (data: PersonaResponse) => {
        // Actualizar los valores del formulario con los datos obtenidos
        this.myForm.patchValue({
          nombrePersona: data.nombre,
          apPaternoPersona: data.apellidoPaterno,
          apMaternoPersona: data.apellidoMaterno
        });
      },
      error: () => {},
      complete: () => {}
    });
  } else {
    console.error('El campo "Numero de Documento" es requerido.');
  }
}

  obtenerTDocs(){
     this._tipoDocumentoService.getAll().subscribe({
      next:(data:TipoDocumentoResponse[])=>
        {
          this.tipoDocumento=data;
        },
      error:()=>{},
      complete:()=>{}
    })
  }

  editarRegistro(){
    this._personaService.update(this.personaEnvio).subscribe({
      next:(data:PersonaResponse)=>{
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
