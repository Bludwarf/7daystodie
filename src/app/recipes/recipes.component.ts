import {Component, OnInit, ViewChild} from '@angular/core';
import {DynamicDataSource, DynamicFlatNode, DynamicFlatTreeControl} from '../common/dynamic-flat-tree';
import {RecipeItem, RecipesDatabase} from './recipes.database';
import {LocalizationService} from '../services/config/localization.service';
import {SummaryComponent} from './summary/summary.component';
import {PerksService} from '../progression/perks.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  providers: [RecipesDatabase]
})
export class RecipesComponent implements OnInit {
  treeControl: DynamicFlatTreeControl<RecipeItem>;
  dataSource: DynamicDataSource<RecipeItem>;
  @ViewChild(SummaryComponent) summary: SummaryComponent;

  constructor(database: RecipesDatabase, private localization: LocalizationService, public perks: PerksService) {
    this.treeControl = new DynamicFlatTreeControl<RecipeItem>();
    this.dataSource = new DynamicDataSource(this.treeControl, database);
    this.dataSource.data = database.initialData();
    this.dataSource.filterPredicate = (recipeItem: RecipeItem, filter) => {
      return recipeItem.item.name.toLowerCase().indexOf(filter) !== -1 // Without translation
        || this.localization.translate(recipeItem.item.name).toLowerCase().indexOf(filter) !== -1;  // With translation
    };
  }

  hasChildren = (_: number, nodeData: DynamicFlatNode<RecipeItem>) => nodeData.hasChildren;

  ngOnInit(): void {
    this.dataSource.itemExpanded.subscribe(item => item && this.summary.remove(item));
    this.dataSource.itemCollapsed.subscribe(item => item && this.summary.push(item));
    this.dataSource.itemsAppeared.subscribe(nodes => nodes.forEach(node => this.summary.push(node)));
    this.dataSource.itemsDisappeared.subscribe(nodes => nodes.forEach(node => this.summary.remove(node)));
  }

  applyFilter(name: string): void {
    this.dataSource.filter = name.trim().toLowerCase();
  }

  getRequiredPerkLevelForRecipe(recipeItem: RecipeItem) {
    const perkLevel = this.perks.getRequiredPerkLevelForRecipe(recipeItem.item.name);
    if (!perkLevel) {
      console.error(`Cannot find required PerkLevel for recipe "${recipeItem.item.name}"`);
      return undefined;
    }
    const localName = this.localization.translate(perkLevel.name + 'Name');
    return `${localName} ${this.localization.translate('xuiSkillLevel')} ${perkLevel.level}`;
  }
}
