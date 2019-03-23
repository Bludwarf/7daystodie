import {Component, Input, OnInit} from '@angular/core';
import {RecipeItem} from '../recipes.database';
import {MatTreeNodeDef} from '@angular/material';
import {PerkLevel, PerksService} from '../../progression/perks.service';
import {LocalizationService} from '../../localization/localization.service';
import {RecipesComponent} from '../recipes.component';

@Component({
  selector: 'app-recipe-node',
  templateUrl: './recipe-node.component.html',
  styleUrls: ['./recipe-node.component.scss']
})
export class RecipeNodeComponent implements OnInit {

  @Input('node') node: MatTreeNodeDef<RecipeItem>;
  @Input('recipes') recipes: RecipesComponent;

  constructor() { }

  ngOnInit() {
  }

}
