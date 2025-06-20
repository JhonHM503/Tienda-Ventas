import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {ModalModule} from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { MantTipoDocumentoListComponent } from './component/tipoDocumento/mant-tipo-documento-list/mant-tipo-documento-list.component';
import { MantTipoDocumentoRegisterComponent } from './component/tipoDocumento/mant-tipo-documento-register/mant-tipo-documento-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MantMedioPagoListComponent } from './component/medioPago/mant-medio-pago-list/mant-medio-pago-list.component';
import { MantMedioPagoRegisterComponent } from './component/medioPago/mant-medio-pago-register/mant-medio-pago-register.component';
import { MantPersonaRegisterComponent } from './component/persona/mant-persona-register/mant-persona-register.component';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantRolListComponent } from './component/rol/mant-rol-list/mant-rol-list.component';
import { MantRolRegisterComponent } from './component/rol/mant-rol-register/mant-rol-register.component';
import { MantUsuarioListComponent } from './component/usuario/mant-usuario-list/mant-usuario-list.component';
import { MantUsuarioRegisterComponent } from './component/usuario/mant-usuario-register/mant-usuario-register.component';
import { MantImagenRegisterComponent } from './component/imagen/mant-imagen-register/mant-imagen-register.component';
import { MantImagenListComponent } from './component/imagen/mant-imagen-list/mant-imagen-list.component';
import { MantProductoListComponent } from './component/producto/mant-producto-list/mant-producto-list.component';
import { MantProductoRegisterComponent } from './component/producto/mant-producto-register/mant-producto-register.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MantCategoriaListComponent } from './component/categoria/mant-categoria-list/mant-categoria-list.component';
import { MantCategoriaRegisterComponent } from './component/categoria/mant-categoria-register/mant-categoria-register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MantVentaListComponent } from './component/venta/mant-venta-list/mant-venta-list.component';
import { MantVentaRegisterComponent } from './component/venta/mant-venta-register/mant-venta-register.component';
import { MantDetalleVentaLsitComponent } from './component/detalleVenta/mant-detalle-venta-lsit/mant-detalle-venta-lsit.component';
import { MantDetalleVentaRegisterComponent } from './component/detalleVenta/mant-detalle-venta-register/mant-detalle-venta-register.component';
import { MantRegistroVentaComponent } from './component/registroVenta/mant-registro-venta/mant-registro-venta.component';
import { MantHistorialVentaComponent } from './component/registroVenta/mant-historial-venta/mant-historial-venta.component';
import { ReporteVentasComponent } from './component/reporte/reporte-ventas/reporte-ventas.component';


@NgModule({
  declarations: [
    MantTipoDocumentoListComponent,
    MantTipoDocumentoRegisterComponent,
    MantMedioPagoListComponent,
    MantMedioPagoRegisterComponent,
    MantPersonaRegisterComponent,
    MantPersonaListComponent,
    MantRolListComponent,
    MantRolRegisterComponent,
    MantUsuarioListComponent,
    MantUsuarioRegisterComponent,
    MantImagenRegisterComponent,
    MantImagenListComponent,
    MantProductoListComponent,
    MantProductoRegisterComponent,
    MantCategoriaListComponent,
    MantCategoriaRegisterComponent,
    MantVentaListComponent,
    MantVentaRegisterComponent,
    MantDetalleVentaLsitComponent,
    MantDetalleVentaRegisterComponent,
    MantRegistroVentaComponent,
    MantHistorialVentaComponent,
    ReporteVentasComponent

  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    SharedModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
  ]
})
export class MantenimientoModule { }
