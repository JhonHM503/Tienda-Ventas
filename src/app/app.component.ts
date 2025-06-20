import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { AuthService } from './services/auth.service';
// import { CargoRequest } from './models/cargo-request.model';
// import { CargoService } from './services/cargo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// export class AppComponent implements OnInit,AfterViewInit
export class AppComponent {
  

  // usuario = "admin";
  // password = "123456";
  // nombreUsuario = "";
 
  title = 'FrontFinal';

  // //declaramos la variable token
  // token:string ="";
  // cargoRequest: CargoRequest = new CargoRequest();
  
  // cargos:CargoRequest[]=[];

  // constructor(  
  //   private _authService: AuthService,
  //   private _cargoService: CargoService
  // ){
    
  // }

  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }

  // ngAfterViewInit(): void {
    
  // }

  // iniciarSesion(){
  //   let loginRequest:any = {};
  //   console.log("usuario ===",this.usuario);
  //   console.log("password ===",this.password);

  //   loginRequest.userName=this.usuario;
  //   loginRequest.password=this.password;

  //    //ESTO YA NO VA 
  //   // this._authService.roles().subscribe({
  //   //   next: (data: any) => {
  //   //     console.log("IMPRIMIENDO ROLES ",data);
  //   //     // this.token=data.token;
  //   //     // this.listarRoles();
  //   //    },
  //   //   error: () => {},
  //   //   complete: () => {},
    
  //   // });

      
  //   this._authService.login(loginRequest).subscribe({
  //     next: (data: any) => {
  //       console.log("IMPRIMIENDO RESULTADOS LOGIN",data);
  //       this.token=data.token;
  //       this.listarRoles();
  //      },
  //     error: () => {},
  //     complete: () => {},
    
  //   });
  // }


  // // COMO PARARAMTRO SE DEBE ENVIAR EL TOKEN OBTENIDO AL 
  // // MOMENTO DE INICIAR SESION
  // listarRoles(){
  //   this.cargos=[];
  //   console.log("token ==>",this.token);

  //   this._authService.roles(/*this.token*/).subscribe({
  //     next: (data: any) => {
  //       console.log("IMPRIMIENDO ROLES",data);
  //       this.cargos=data;
  //      },
  //     error: () => {
  //        console.log("NO SE PUDO IMPRIMIENDO ROLES");
  //     },
  //     complete: () => {},
  //   });
  // }


  // crearCargo(){

  //   if(this.cargoRequest.id==0)
  //   {
  //     this._cargoService.create(/*this.token,*/this.cargoRequest).subscribe({
  //       next:()=>{
  //         alert("CREADO")
  //         this.listarRoles();
  //       },
  //       error:()=>{
  //         alert("Ocurrio un error")
  //       },
  //       complete:()=>{},
  //     });
      
  //   }
  //   else{
  //     this._cargoService.update(/*this.token,*/this.cargoRequest).subscribe({
  //       next:()=>{
  //         alert("ACTUALIZADO")
  //         this.listarRoles();
  //       },
  //       error:()=>{
  //         alert("Ocurrio un error")
  //       },
  //       complete:()=>{},
  //     });
  //   }
  // }

  // rellenarValores(cargo:CargoRequest){

  //   this.cargoRequest=cargo;   
    
  // }

  // eliminarRegistro(id:number){

  //   let eliminar = confirm("¿Esta seguro de eliminar?");
  //   if(eliminar){
      
  //     this._cargoService.delete(/*this.token,*/id).subscribe({
  //         next:()=>{
  //           alert("ELIMINADO")
  //           this.listarRoles();
  //         },
  //         error:()=>{
  //           alert("Ocurrio un error")
  //         },
  //         complete:()=>{},
  //       });

  //   }

  // }


}
