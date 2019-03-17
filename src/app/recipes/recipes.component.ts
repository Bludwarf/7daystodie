import {Component, OnInit} from '@angular/core';
import {DynamicDataSource, DynamicFlatNode, DynamicFlatTreeControl} from '../common/dynamic-flat-tree';
import {RecipeItem, RecipesDatabase} from './recipes.database';
import {LocalizationService} from '../services/config/localization.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  providers: [RecipesDatabase]
})
export class RecipesComponent implements OnInit {
  treeControl: DynamicFlatTreeControl<RecipeItem>;
  dataSource: DynamicDataSource<RecipeItem>;

  constructor(database: RecipesDatabase, private localization: LocalizationService) {
    this.treeControl = new DynamicFlatTreeControl<RecipeItem>();
    this.dataSource = new DynamicDataSource(this.treeControl, database);
    this.dataSource.data = database.initialData();
    this.dataSource.filterPredicate = (recipeItem: RecipeItem, filter) => {
      return recipeItem.item.name.toLowerCase().indexOf(filter) !== -1 // Without translation
        || this.localization.translate(recipeItem.item.name).toLowerCase().indexOf(filter) !== -1;  // With translation
    }
  }

  hasChildren = (_: number, nodeData: DynamicFlatNode<RecipeItem>) => nodeData.hasChildren;

  ngOnInit(): void {
  }

  applyFilter(name: string): void {
    this.dataSource.filter = name.trim().toLowerCase();
  }
}
