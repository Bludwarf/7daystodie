import {Component, Input, OnInit} from '@angular/core';
import {RecipeItem} from '../recipes.database';
import {RecipesComponent} from '../recipes.component';
import {DynamicFlatNode} from '../../common/dynamic-flat-tree';

@Component({
  selector: 'app-recipe-node',
  templateUrl: './recipe-node.component.html',
  styleUrls: ['./recipe-node.component.scss']
})
export class RecipeNodeComponent implements OnInit {

  @Input('node') node: DynamicFlatNode<RecipeItem>;
  @Input('recipes') recipes: RecipesComponent;

  constructor() { }

  ngOnInit() {
  }

}
