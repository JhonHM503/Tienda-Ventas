import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioResponse } from '../../../models/usuario-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioRequest } from '../../../models/usuario-request.model';
import { UsuarioService } from '../../../service/usuario.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { PersonaRequest } from '../../../models/persona-request.model';
import { PersonaService } from '../../../service/persona.service';
import { PersonaResponse } from '../../../models/persona-response.model';
import { alert_error, alert_success } from 'src/app/functions/general.functions';
import { TipoDocumentoResponse } from '../../../models/tipoDocumento-response.model';
import { TipoDocumentoService } from '../../../service/tipo-documento.service';
import { RolResponse } from '../../../models/rol-response.model';
import { AuthService } from '../../../service/auth.service';
import { RegisterRequest } from 'src/app/modulos/auth/models/register-request';

@Component({
  selector: 'app-mant-usuario-register',
  templateUrl: './mant-usuario-register.component.html',
  styleUrls: ['./mant-usuario-register.component.scss']
})
export class MantUsuarioRegisterComponent implements OnInit {

  // Declarando variables de entrada
  @Input() title:string="";
  @Input() accion: number = 0;
  @Input() usuario:UsuarioResponse= new UsuarioResponse();
  @Input() persona:PersonaResponse = new PersonaResponse();
  @Input() tiposDeDocumentos:TipoDocumentoResponse[] =[];
  @Input() roles:RolResponse[] = []

    // Declarando variables de SALI
  @Output() closeModalEmmit = new EventEmitter<boolean>();


  // Declarando variables de internas
  myForm:FormGroup;
  usuarioEnvio:UsuarioRequest = new UsuarioRequest();
  personaEnvio:PersonaRequest = new PersonaRequest();

  tipoDocumentos:TipoDocumentoResponse[]=[];

  buscando=false;
  //delcaramos el constructor
  constructor(
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _personaService: PersonaService,
    private _tipodocumentoService:TipoDocumentoService ,
    private _authService: AuthService
  )
  {
    //nuestro formulario usuario request
    this.myForm=this.fb.group({
      
      // Persona fields
      idPersona: [{ value: 0, disabled: true }, [Validators.required]],
      idTipoDocumento: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      apellidoPaterno: [null, [Validators.required]],
      apellidoMaterno: [null, [Validators.required]],
      numeroDocumento: [null, [Validators.required]],
      // fechaNacimiento: [null, [Validators.required]],
      // direccion: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      

      // Usuario fields
      idUsuario: [{ value: 0, disabled: true }, [Validators.required]],
      idRol: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      email: [null, [Validators.required]],
      fechaRegistro: [null],

    })
  } 

  ngOnInit(): void {
     if (this.accion === AccionMantConst.editar) {
      this.myForm.patchValue({ ...this.persona, ...this.usuario });
    }
    this.buscarDNI();
    
  }

  guardarRegistro()
  {
     if (this.myForm.valid) {
      const formValue = this.myForm.getRawValue();
      this.personaEnvio = {
        idPersona: formValue.idPersona,
        idTipoDocumento: formValue.idTipoDocumento,
        nombre: formValue.nombre,
        apellidoPaterno: formValue.apellidoPaterno,
        apellidoMaterno: formValue.apellidoMaterno,
        numeroDocumento: formValue.numeroDocumento,
        fechaNacimiento: formValue.fechaNacimiento,
        direccion: formValue.direccion,
        telefono: formValue.telefono
      };
      this.usuarioEnvio = {
        idUsuario: formValue.idUsuario,
        idPersona: formValue.idPersona,
        idRol: formValue.idRol,
        username: formValue.username,
        password: formValue.password,
        email: formValue.email,
        fechaRegistro: formValue.fechaRegistro
      };

      switch (this.accion) {
        case AccionMantConst.crear:
          this.crearRegistro();
          break;
        case AccionMantConst.editar:
          this.editarRegistro();
          break;
      }
    } else {
      alert_error("Formulario inválido", "Por favor, complete todos los campos requeridos.");
    }
  }

  crearRegistro(){
     // Crear un objeto RegisterRequest
    const registerRequest: RegisterRequest = {
      idTipoDocumento: this.personaEnvio.idTipoDocumento,
      idRol: this.usuarioEnvio.idRol,
      nombre: this.personaEnvio.nombre,
      apellidoPaterno: this.personaEnvio.apellidoPaterno,
      apellidoMaterno: this.personaEnvio.apellidoMaterno,
      numeroDocumento: this.personaEnvio.numeroDocumento,
      telefono: this.personaEnvio.telefono,
      userName: this.usuarioEnvio.username,
      password: this.usuarioEnvio.password,
      email: this.usuarioEnvio.email
    };

    this._authService.register(registerRequest).subscribe({
      next: (data) => {
        alert_success("Registro creado", "La persona y el usuario se han creado correctamente.");
        this.cerrarModal(true);
      },
      error: (error) => {
        alert_error("Error", "Ocurrió un error al crear el registro.");
        console.error(error);
      }
    });
  }

  editarRegistro(){
    this._usuarioService.updatePersonaAndUsuario(this.personaEnvio, this.usuarioEnvio).subscribe({
      next: ([personaResponse, usuarioResponse]: [PersonaResponse, UsuarioResponse]) => {
        alert_success("Registro actualizado", "La persona y el usuario se han actualizado correctamente.");
        this.cerrarModal(true);
      },
      error: (error) => {
        alert_error("Error", "Ocurrió un error al actualizar el registro.");
        console.error(error);
      }
    });
  }

  buscarDNI() {
    const dni = this.myForm.get('numeroDocumento')?.value;
    if (dni) {
      this.buscando=true;
      this._personaService.buscarDNI(dni).subscribe({
        next: (data: PersonaResponse) => {
          // Update the form values with the received data
          this.myForm.patchValue({
            nombre: data.nombre,
            apellidoPaterno: data.apellidoPaterno,
            apellidoMaterno: data.apellidoMaterno
          });
          this.buscando=false;
        },
        error: (error) => {
          alert_error("Error", "No se pudo encontrar la información del DNI.");
          console.error(error);
        }
      });
    } else {
    }
  }
  
  soloNumeros(event: KeyboardEvent): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}


  cerrarModal(res:boolean)
  {
    //true ==> hubo modificacion en la base de datos
    //false ==> NO hubo modificacion en la base de datos
    this.closeModalEmmit.emit(res);
  }

  // obtenerTDocs(){
  //    this._tipodocumentoService.getAll().subscribe({
  //     next:(data:TipoDocumentoResponse[])=>
  //       {
  //         this.tipoDocumentos=data;
  //       },
  //     error:()=>{},
  //     complete:()=>{}
  //   })
  // }


}