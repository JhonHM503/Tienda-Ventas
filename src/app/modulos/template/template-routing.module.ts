import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './component/template/template.component';

const routes: Routes = [
  {
    path:'',component:TemplateComponent,
    children:[
      {
        path:'mantenimiento',loadChildren:()=> import("./../mantenimiento/mantenimiento.module").then(x=>x.MantenimientoModule)
      },
      {
        path:'reportes', loadChildren:() => import("./../mantenimiento/mantenimiento.module").then(x =>x.MantenimientoModule)
      },
      {
        path:'ventas', loadChildren:() => import("./../ventas/ventas.module").then(x =>x.VentasModule)
      }
    ]
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
