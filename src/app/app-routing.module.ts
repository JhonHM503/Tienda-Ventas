import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PruebaComponent } from './pages/prueba/prueba.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './guard/auth.guard';


const routes: Routes = [

  //routeo simple
  {
    path:'', 
    loadChildren: () => import('./pages/template/template.module').then(m => m.TemplateModule)//loadChildren:()=>import("./pages/template/template.module").then(x=>x.TemplateModule)
  },
  
  {
    path:'prueba', component:PruebaComponent
  },

  {
    path:'404', component:NotFoundComponent
  },

  {
    path:'auth',
    loadChildren:()=> import("./modulos/auth/auth.module").then(x=>x.AuthModule)
  },

  {
    path:'dashboard',
    canActivate:[authGuard],
    loadChildren:()=> import("./modulos/template/template.module").then(x=>x.TemplateModule)
  },

  {
    path: 'welcome-template',
    
    loadChildren: () => import("./pages/template/template.module").then(m => m.TemplateModule)
  },

  // {
  //   path:'processReservation',loadChildren:()=>import("./pages/template/template.module").then(x=>x.TemplateModule)
  // },


  {path:'ventas', loadChildren: () => import('./modulos/ventas/ventas-routing.module').then(x => x.VentasRoutingModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
