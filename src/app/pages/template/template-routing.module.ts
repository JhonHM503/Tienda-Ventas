import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './component/welcome-template/template.component';


const routes: Routes = [
  {
    path:'', component: TemplateComponent,
    children:[
     
      
    ]
  
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
