import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasRoutingModule } from './ventas-routing.module';
import { ListaProductosComponent } from './components/lista-productos/lista-productos.component';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    ListaProductosComponent,
    
  ],
  exports:[
    ListaProductosComponent
  ]
})
export class VentasModule { }
