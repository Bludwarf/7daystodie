import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WeaponsComponent} from './weapons/weapons.component';
import {RecipesComponent} from './recipes/recipes.component';
import {translate} from './localization/localization.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Recipes',
    pathMatch: 'full'
  },
  {
    path: 'List_of_weapons',
    component: WeaponsComponent,
    data: { title: translate('pageList_of_weapons') }
  },
  {
    path: 'Recipes',
    component: RecipesComponent,
    data: { title: translate('pageRecipes') }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
