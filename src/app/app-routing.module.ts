import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WeaponsComponent} from './weapons/weapons.component';
import {RecipesComponent} from './recipes/recipes.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Recipes',
    pathMatch: 'full'
  },
  {
    path: 'List_of_weapons',
    component: WeaponsComponent,
    data: { title: 'List of weapons' }
  },
  {
    path: 'Recipes',
    component: RecipesComponent,
    data: { title: 'Recipes' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
