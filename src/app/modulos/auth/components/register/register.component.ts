import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterRequest } from '../../models/register-request';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { RegisterResponse } from '../../models/register-response';
import { AuthStateService } from '../../service/AuthStateService.service';
import { TipoDocumentoResponse } from 'src/app/modulos/mantenimiento/models/tipoDocumento-response.model';
import { TipoDocumentoService } from 'src/app/modulos/mantenimiento/service/tipo-documento.service';
import { PersonaService } from 'src/app/modulos/mantenimiento/service/persona.service';
import { PersonaRequest } from 'src/app/modulos/mantenimiento/models/persona-request.model';
import { alert_login_success } from 'src/app/functions/general.functions';

@Component({
  selector: 'app-register',
  standalone: false,
  // imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  registerForm: FormGroup;
  registerRequest: RegisterRequest = new RegisterRequest();

  tiposDeDocumentos: TipoDocumentoResponse[] = [];

  buscando = false;

  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _tipoDocumento: TipoDocumentoService,
    private authStateService:AuthStateService,
    private _personaService:PersonaService,
    private _router: Router
  ) {
    this.registerForm = this.fb.group({
      idTipoDocumento: [null, Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      telefono: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    window.scrollTo(0,0),
    this.fetchTiposDeDocumentos();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.registerRequest ={
        ...this.registerForm.value,
        IdRol:3
      } 

      this.authService.register(this.registerRequest).subscribe({
        next: (response: RegisterResponse) => {
          console.log(response)
          if (response.success) {
            alert_login_success('Creación de cuenta exitosa','!BIENVENIDO¡')
            console.log('Registro exitoso', response);

            // PRIMERO: Guardar todos los datos en sessionStorage
            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem('username', response.usuario.username);
            sessionStorage.setItem('idUsuario', response.usuario.idUsuario.toString());
            sessionStorage.setItem("fullName", response.persona.nombre);
            sessionStorage.setItem("rolId", response.rol.idRol.toString());
            sessionStorage.setItem("NombreRol", response.rol.nombre);

            // Después de guardar en sessionStorage
            console.log('Token guardado:', sessionStorage.getItem('token'));
            console.log('Username guardado:', sessionStorage.getItem('username'));
            console.log('UserId guardado:', sessionStorage.getItem('idUsuario'));

            
            // Actualizar el AuthStateService
            this.authStateService.setLoggedIn(true);
            this.authStateService.setUsername(response.usuario.username);
            this.authStateService.setUserId(response.usuario.idUsuario);

            // Pequeña pausa para asegurar que todo se guarde correctamente
            this._router.navigate(['/welcome-template'])
          } else {
            console.error('Error en el registro:', response.mensaje);
            // Manejar el error, mostrar un mensaje al usuario, etc.
          }
        },
        error: (err) => {
          console.error('Error en la solicitud de registro:', err);
          // Manejar el error, mostrar un mensaje al usuario, etc.
        }
      });
    } 
  }

  fetchTiposDeDocumentos() {
  this._tipoDocumento.getAll().subscribe({
    next: (response) => {
      this.tiposDeDocumentos = response;
    },
    error: (error) => {
      console.error('Error fetching tipos de documentos:', error);
    }
  });
}
  getTipoDocumentoName(idTipoDocumento: number): string {
  const tipoDocumento = this.tiposDeDocumentos.find(td => td.idTipoDocumento === idTipoDocumento);
  return tipoDocumento ? tipoDocumento.nombre : 'Desconocido';
  }

  buscarDNI(){
    const dni = this.registerForm.get('numeroDocumento')?.value;
    if(dni){
      this.buscando = true;
      this._personaService.buscarDNI(dni).subscribe({
        next:(persona: PersonaRequest)=>{
          if (persona) {
             // Actualizar el formulario con los datos de la persona
            this.registerForm.patchValue({
              nombre: persona.nombre,
              apellidoPaterno: persona.apellidoPaterno,
              apellidoMaterno: persona.apellidoMaterno,
              // Actualiza otros campos según sea necesario
            });
            this.buscando = false;
          }else{
              console.log('No se encontró una persona con ese DNI');
          }
        },
        error: (error) => {
          console.error('Error al buscar DNI:', error);
          // Maneja el error, muestra un mensaje al usuario, etc.
        }
      })
    }
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
