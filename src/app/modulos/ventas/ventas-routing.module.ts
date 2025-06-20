import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProductosComponent } from './components/lista-productos/lista-productos.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DetalleCompraComponent } from './components/detalle-compra/detalle-compra.component';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos.component';
import { GeneralVentasComponent } from './components/general-ventas/general-ventas.component';

const routes: Routes = [
  {path:'productos', component:ListaProductosComponent},
  {path:'carrito', component:CarritoComponent},
  {path:'detalle-compra', component:DetalleCompraComponent},
  {path:'mis-pedidos', component:MisPedidosComponent},
  {path:'general-ventas',component:GeneralVentasComponent},
  {path:'', redirectTo:'productos', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
