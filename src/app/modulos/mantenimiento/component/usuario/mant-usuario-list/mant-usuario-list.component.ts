import { Component, OnInit, TemplateRef } from '@angular/core';
import { UsuarioResponse } from '../../../models/usuario-response.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { VUsuarioPersonaRol } from '../../../models/VUsuarioPersonaRol.model';
import { GenericFilterRequest } from 'src/app/models/generic-filter-request.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterResponse } from 'src/app/models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PersonaResponse } from '../../../models/persona-response.model';
import { PersonaService } from '../../../service/persona.service';
import { alert_confirm_delete, alert_delete_error, alert_delete_success } from 'src/app/functions/general.functions';
import { forkJoin } from 'rxjs';
import { TipoDocumentoService } from '../../../service/tipo-documento.service';
import { RolService } from '../../../service/rol.service';
import { TipoDocumentoResponse } from '../../../models/tipoDocumento-response.model';
import { RolResponse } from '../../../models/rol-response.model';

@Component({
  selector: 'app-mant-usuario-list',
  templateUrl: './mant-usuario-list.component.html',
  styleUrls: ['./mant-usuario-list.component.scss']
})
export class MantUsuarioListComponent implements OnInit{

  config ={
    backdrop:true,
    ignoreBackdropClick:true
  };

  usuarios:UsuarioResponse[]=[];
  usuarioSelected: UsuarioResponse=new UsuarioResponse();
  personaSelected: PersonaResponse = new PersonaResponse();

  usuariosConPersonas: Array<{usuario: UsuarioResponse, persona: PersonaResponse}> = [];
  filteredUsuariosConPersonas: Array<{usuario: UsuarioResponse, persona: PersonaResponse}> = [];

   //OBTENER DE MANERA NO OPTIMA
  tiposDeDocumentos: TipoDocumentoResponse[] = [];
  roles:RolResponse[]=[];

  modalRef?: BsModalRef;
  titleModal:string="";
  accionModal:number=0;
  filterForm :FormGroup; 
  totalItems:number=0;
  itemsPerPage:number = 5;
  request: GenericFilterRequest = new GenericFilterRequest();

  constructor(
    private _route:Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private _usuarioService:UsuarioService,
    private _personaService: PersonaService,
    private _tipoDocumentoService: TipoDocumentoService,
    private _rolService: RolService
  )
  {
    this.filterForm =this.fb.group({
      nombre: [''],
      apellidos: [''],
      rol: [''],
      tipoDocumento: [''],
      numeroDocumento: [''],
      email: ['']
    });

  }



  // PRIMER EVENTO QUE EJECUTA EL COMPONENTE
  ngOnInit(): void {

    // this.listarUsuarios();
    this.listarUsuariosConPersonas();
    this.obternerListas();
    
  }

  // listarUsuarios()
  // {
  //   this._usuarioService.getAll().subscribe({
  //     next:(data:UsuarioResponse[])=>{
  //       this.usuarios=data
  //       console.log("usuarios",data);
  //     },
  //     error:(err)=>{
  //       console.log("error",err);
  //     },
  //     complete:()=>{
  //       //falta
  //     },
  //   });
  // }
   listarUsuariosConPersonas() {
    this._usuarioService.getAll().subscribe({
      next: (usuarios: UsuarioResponse[]) => {
        const observables = usuarios.map(usuario => 
          this._personaService.getById(usuario.idPersona)
        );
        
        forkJoin(observables).subscribe({
          next: (personas: PersonaResponse[]) => {
            this.usuariosConPersonas = usuarios.map((usuario, index) => ({
              usuario,
              persona: personas[index]
            })).reverse();
            this.filteredUsuariosConPersonas = [...this.usuariosConPersonas];
          },
          error: (err) => console.error("Error fetching personas", err)
        });
      },
      error: (err) => console.error("Error fetching usuarios", err)
    });
  }

  aplicaFiltros() {
  const filtros = this.filterForm.value;

  this.filteredUsuariosConPersonas = this.usuariosConPersonas.filter(item => {
    return (
      (filtros.nombre ? item.persona.nombre.toLowerCase().startsWith(filtros.nombre.toLowerCase()) : true) &&
      (filtros.apellidos ? 
        (item.persona.apellidoPaterno + ' ' + item.persona.apellidoMaterno).toLowerCase().startsWith(filtros.apellidos.toLowerCase()) : true) &&
      (filtros.rol ? item.usuario.idRol === parseInt(filtros.rol) : true) &&
      (filtros.tipoDocumento ? item.persona.idTipoDocumento === parseInt(filtros.tipoDocumento) : true) &&
      (filtros.numeroDocumento ? item.persona.numeroDocumento.includes(filtros.numeroDocumento) : true) &&
      (filtros.email ? item.usuario.email.startsWith(filtros.email) : true)
    );
  });
}

  limpiarFiltros() {
    this.filterForm.reset();
    this.filteredUsuariosConPersonas = [...this.usuariosConPersonas];
  }


  crearUsuario(template: TemplateRef<any>)
  {
    this.titleModal="NUEVO USUARIO";
    this.usuarioSelected=new UsuarioResponse();
    this.personaSelected=new PersonaResponse();
    this.accionModal=AccionMantConst.crear;
    this.openModal(template);
  }

  // editarUsuario(template: TemplateRef<any>,usuario:UsuarioResponse)
  // { 
  //   this.usuarioSelected = usuario;
  //   this._personaService.getById(usuario.idPersona).subscribe({
  //     next: (persona: PersonaResponse) => {
  //       this.personaSelected = persona;
  //       this.titleModal = "MODIFICAR USUARIO Y PERSONA";
  //       this.accionModal = AccionMantConst.editar;
  //       this.openModal(template);
  //     },
  //     error: (err) => {
  //       console.error("Error al obtener datos de la persona", err);
  //     }
  //   });
  // }
  editarUsuario(template: TemplateRef<any>, usuario: UsuarioResponse, persona: PersonaResponse) {
    this.usuarioSelected = usuario;
    this.personaSelected = persona;
    this.titleModal = "MODIFICAR USUARIO Y PERSONA";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  getCloseModalEmmit(res:boolean)
  {
    this.modalRef?.hide();
    if (res){
      this.listarUsuariosConPersonas();
    }
  }

  filtrar()
  {

  }

  changePage(event: PageChangedEvent){
    this.request.numeroPagina = event.page; 
    console.log(event.page)
    this.filtrar();
  }

  changeItemsPerPage()
  {
    this.request.cantidad = this.itemsPerPage;
    this.filtrar();
  }


  eliminarRegistro(id:number)
  {
    alert_confirm_delete('¿Estás seguro?', '¡Esta acción es irreversible!').then((result) => {
      if (result.isConfirmed) {
        this._usuarioService.delete(id).subscribe({
          next: (data: number) => {
            alert_delete_success("Registro eliminado", "El registro se ha eliminado correctamente.");
            this.listarUsuariosConPersonas();
          },
          error: () => {
            alert_delete_error("Error", "Ocurrió un error al eliminar el registro.");
          }
        });
      }
    });
  }

  obternerListas(){
    forkJoin([
      this._tipoDocumentoService.getAll(),
      this._rolService.getAll(),
    ]).subscribe({
      next:(data:any)=>{
        this.tiposDeDocumentos = data[0]
        this.roles = data[1]
      },
      error:(err)=>{},
      complete:() => {},
    });
  }


  getRolName(idRol: number): string {
  const rol = this.roles.find(r => r.idRol === idRol);
  return rol ? rol.nombre : 'Desconocido';
}

getTipoDocumentoName(idTipoDocumento: number): string {
  const tipoDocumento = this.tiposDeDocumentos.find(td => td.idTipoDocumento === idTipoDocumento);
  return tipoDocumento ? tipoDocumento.nombre : 'Desconocido';
}

isAdmin(idRol: number): boolean {
  const rolName = this.getRolName(idRol).toLowerCase().trim();
  return rolName === 'administrador';
}
}
