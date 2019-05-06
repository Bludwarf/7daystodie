import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WeaponsComponent} from './weapons/weapons.component';
import {RecipesComponent} from './recipes/recipes.component';
import {translate} from './localization/localization.service';
import {RecipeComponent} from './recipe/recipe.component';
import {RecipeResolverService} from './recipe/recipe-resolver.service';
import {CanDeactivateGuard} from './can-deactivate.guard';
import {ItemComponent} from './item/item.component';
import {ItemResolverService} from './item/item-resolver.service';

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
  },
  {
    path: 'Recipes/:name',
    component: RecipeComponent,
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      recipe: RecipeResolverService
    },
    data: {
      title: translate('pageRecipe')
    },
  },
  {
    path: 'items/:name',
    component: ItemComponent,
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      item: ItemResolverService
    },
    data: {
      // TODO : title: translate('pageRecipe')
    },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
