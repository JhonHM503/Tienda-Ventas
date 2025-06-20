import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantTipoDocumentoListComponent } from './component/tipoDocumento/mant-tipo-documento-list/mant-tipo-documento-list.component';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantRolListComponent } from './component/rol/mant-rol-list/mant-rol-list.component';
import { MantUsuarioListComponent } from './component/usuario/mant-usuario-list/mant-usuario-list.component';
import { MantImagenListComponent } from './component/imagen/mant-imagen-list/mant-imagen-list.component';
import { MantProductoListComponent } from './component/producto/mant-producto-list/mant-producto-list.component';
import { MantCategoriaListComponent } from './component/categoria/mant-categoria-list/mant-categoria-list.component';
import { MantVentaListComponent } from './component/venta/mant-venta-list/mant-venta-list.component';
import { MantDetalleVentaLsitComponent } from './component/detalleVenta/mant-detalle-venta-lsit/mant-detalle-venta-lsit.component';
import { MantRegistroVentaComponent } from './component/registroVenta/mant-registro-venta/mant-registro-venta.component';
import { MantHistorialVentaComponent } from './component/registroVenta/mant-historial-venta/mant-historial-venta.component';
import { ReporteVentasComponent } from './component/reporte/reporte-ventas/reporte-ventas.component';
import { MantMedioPagoListComponent } from './component/medioPago/mant-medio-pago-list/mant-medio-pago-list.component';


const routes: Routes = [

  {
    path:'tipoDocumento', component:MantTipoDocumentoListComponent
  },
  {
    path:'persona', component:MantPersonaListComponent
  },
  {
    path:'rol', component:MantRolListComponent
  },
  {
    path:'usuario', component:MantUsuarioListComponent
  },
  {
    path:'imagen',component:MantImagenListComponent
  },
  {
    path:'producto',component:MantProductoListComponent
  },
  {
    path:'medioPago', component:MantMedioPagoListComponent
  },
  {
    path:'categoria',component:MantCategoriaListComponent
  },
  {
    path:'venta',component:MantVentaListComponent
  },
  {
    path:'detalleVenta',component:MantDetalleVentaLsitComponent
  },
  {
    path:'registroVenta',component:MantRegistroVentaComponent
  },
  {
    path:'historialVenta',component:MantHistorialVentaComponent
  },
  {
    path:'reporteVenta',component:ReporteVentasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
