import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Recipe, RecipesService} from '../recipes/recipes.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe> {

  constructor(private service: RecipesService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe> | Promise<Recipe> | Recipe {
    // TODO https://angular.io/guide/router#observable-parammap-and-component-reuse
    // TODO observable resolve https://angular.io/guide/router#resolve-pre-fetching-component-data
    const name = route.paramMap.get('name');
    const recipe = this.service.get(name);
    if (recipe) {
      return recipe;
    } else {
      console.error(`Recipe "${name}" not found !"`);
      this.router.navigate(['/Recipes']);
      return undefined;
    }
  }
}
