import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Recipe, RecipesService} from '../recipes/recipes.service';
import {switchMap} from 'rxjs/internal/operators/switchMap';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  public recipe: Recipe;

  constructor(
    private route: ActivatedRoute,
    private service: RecipesService
  ) { }

  ngOnInit() {
    // TODO https://angular.io/guide/router#observable-parammap-and-component-reuse
    const id = this.route.snapshot.paramMap.get('name');
    this.recipe = this.service.get(id);
    // TODO https://angular.io/guide/router#resolve-pre-fetching-component-data
    if (!this.recipe) {
      throw new Error('Not Found');
    }
  }

}
