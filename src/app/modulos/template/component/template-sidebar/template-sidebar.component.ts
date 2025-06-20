import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-sidebar',
  templateUrl: './template-sidebar.component.html',
  styleUrls: ['./template-sidebar.component.scss']
})
export class TemplateSidebarComponent implements OnInit {
  
  menu:any[]=[]
  ngOnInit(): void {
    
    this.rellenarMenu()
  }

  rellenarMenu(){
    let rolId = sessionStorage.getItem("rolId");

    switch(rolId)
    {
      //TODO: CUANDO ES ADMINISTRADOR
      case"1":
        this.menu = [
          {
            name:"Productos", target:"TargerMantenimiento", icon:"fas fa-databasefas fa-warehouse",
            subMenu:[
              {name:"Productos",url:"mantenimiento/producto",icon:"fas fa-box"},
              {name:"Categorias",url:"mantenimiento/categoria",icon:"fas fa-th-list"},
              
            ]
          },
          {
            name:"Ventas", target:"TargerVentas", icon:"fas fa-shopping-cart",
            subMenu:[
              // {name:"Ventas",url:"mantenimiento/venta",icon:"fas fa-tags"},
              // {name:"DetalleVenta",url:"mantenimiento/detalleVenta",icon:"fas fa-tags"},
              {name:"Registro",url:"mantenimiento/registroVenta",icon:"fas fa-receipt "},
              {name:"Historial",url:"mantenimiento/historialVenta",icon:"fas fa-history "},
              {name:"Metodos Pago",url:"mantenimiento/medioPago",icon:"fas fa-credit-card "},
            ]
          },
          {
            name:"Gestión de Usuarios", target:"TargerUsuarios", icon:"fas fa-user-cog",
            subMenu:[
              {name:"Usuarios",url:"mantenimiento/usuario",icon:"fas fa-users"},
              {name:"Tipo de documento",url:"mantenimiento/tipoDocumento",icon:" fas fa-id-card "},
              {name:"Roles",url:"mantenimiento/rol",icon:"fas fa-user-shield"},
            ] 
          },
          {
            name:"Informes", target:"TargerRepodter", icon:"fas fa-file-alt",
            subMenu:[
              {name:"Reportes",url:"mantenimiento/reporteVenta",icon:" fas fa-chart-line"},
            ]
          }
        ];
        break;
      case"2":
       this.menu = [
          {
            name:"Ventas", target:"TargerVentas", icon:"fas fa-edit",
            subMenu:[
              {name:"Registro",url:"mantenimiento/registroVenta",icon:"fas fa-tags"},
              {name:"Historial",url:"mantenimiento/historialVenta",icon:"fas fa-tags"},
            ]
          },
        ];
      break;
      case"3":break;
      case"4":break;
      case"5":break;
      case"6":break;
    }
  }

  
}
