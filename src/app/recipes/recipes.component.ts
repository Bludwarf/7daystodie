import {Component, OnInit} from '@angular/core';
import {DynamicDataSource, DynamicFlatNode, DynamicFlatTreeControl} from '../common/dynamic-flat-tree';
import {RecipeItem, RecipesDatabase} from './recipes.database';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  providers: [RecipesDatabase]
})
export class RecipesComponent implements OnInit {
  treeControl: DynamicFlatTreeControl<RecipeItem>;
  dataSource: DynamicDataSource<RecipeItem>;

  constructor(database: RecipesDatabase) {
    this.treeControl = new DynamicFlatTreeControl<RecipeItem>();
    this.dataSource = new DynamicDataSource(this.treeControl, database);
    this.dataSource.data = database.initialData();
  }

  hasChildren = (_: number, nodeData: DynamicFlatNode<RecipeItem>) => nodeData.hasChildren;

  ngOnInit(): void {
  }
}
