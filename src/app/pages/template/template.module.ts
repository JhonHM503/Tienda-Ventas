import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { TemplateComponent } from './component/welcome-template/template.component';
import { TemplateFooterComponent } from './component/welcome-template-footer/template-footer.component';
import { TemplateHeaderComponent } from './component/welcome-template-header/template-header.component';
import { TemplateSidebarComponent } from './component/welcome-template-sidebar/template-sidebar.component';
import { VentasModule } from 'src/app/modulos/ventas/ventas.module';
import { ListaProductosComponent } from 'src/app/modulos/ventas/components/lista-productos/lista-productos.component';
import { CarritoComponent } from 'src/app/modulos/ventas/components/carrito/carrito.component';
import { DetalleCompraComponent } from 'src/app/modulos/ventas/components/detalle-compra/detalle-compra.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TemplateComponent,
    TemplateFooterComponent,
    TemplateHeaderComponent,
    TemplateSidebarComponent,
    
  ],
  imports: [
    CommonModule,
    ListaProductosComponent,
    CarritoComponent,
    DetalleCompraComponent,
    TemplateRoutingModule,
    VentasModule,
    FormsModule,
    
  ],
  exports:[
    TemplateComponent,
    TemplateHeaderComponent
  ]
})
export class TemplateModule { }
