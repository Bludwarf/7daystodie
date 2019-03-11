import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WeaponsComponent} from './weapons/weapons.component';

const routes: Routes = [
  {
    path: 'List_of_weapons',
    component: WeaponsComponent,
    data: { title: 'List of weapons' }
  },
  {
    path: '',
    redirectTo: '/List_of_weapons',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
