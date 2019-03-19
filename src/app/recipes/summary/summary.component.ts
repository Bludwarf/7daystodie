import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {RecipeItem} from '../recipes.database';
import {ItemsService} from '../../services/config/items.service';
import {LocalizationService} from '../../services/config/localization.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  recipeItemsHistory: RecipeItem[] = [];
  dataSource: MatTableDataSource<RecipeItem>;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['name', 'count'];

  constructor(public localization: LocalizationService, private items: ItemsService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {

    // table
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sortingDataAccessor = (recipeItem: RecipeItem, property: string) => {
      switch (property) {
        case 'name': return this.localization.translate(recipeItem.item.name);
        default: return recipeItem.item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (recipeItem: RecipeItem, filter) => {
      return recipeItem.item.name.toLowerCase().indexOf(filter) !== -1 // Without translation
        || this.localization.translate(recipeItem.item.name).toLowerCase().indexOf(filter) !== -1;  // With translation
    };
  }

  get data(): RecipeItem[] {
    const groups = _.groupBy(this.recipeItemsHistory, ri => ri.item.name);
    return Object.keys(groups).map(itemName => {
      const recipeItems: RecipeItem[] = groups[itemName];
      const count = recipeItems.reduce((previousValue, ri) => previousValue + ri.count, 0);
      const recipeItem = recipeItems[0];
      return new RecipeItem(recipeItem.recipe, count, recipeItem.item);
    });
  }

  push(recipeItem: RecipeItem) {
    console.log('push', recipeItem);
    this.recipeItemsHistory.push(recipeItem);
    this.dataSource.data = this.data;
  }

  remove(recipeItem: RecipeItem) {
    const index = this.recipeItemsHistory.indexOf(recipeItem);
    if (index !== -1) {
      this.recipeItemsHistory.splice(index, 1);
      this.dataSource.data = this.data;
    }
  }

}
