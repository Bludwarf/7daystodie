import {Component, OnInit, ViewChild} from '@angular/core';
import {DynamicDataSource, DynamicFlatNode, DynamicFlatTreeControl} from '../common/dynamic-flat-tree';
import {RecipeItem, RecipesDatabase} from './recipes.database';
import {LocalizationService} from '../services/config/localization.service';
import {SummaryComponent} from './summary/summary.component';
import {PerksService} from '../progression/perks.service';
import {MatButtonToggleGroup} from '@angular/material';

export const CRAFT_AREA_ICONS = {
  campfire: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_campfire.png',
  cementMixer: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_cement.png',
  chemistryStation: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_chemistry.png',
  forge: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_forge.png',
  workbench: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_workbench.png'
};

// Angular Material does not filter when filter is empty
const FORCE_FILTER = '<force_filter>';

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

  @ViewChild(MatButtonToggleGroup)
  craftAreaFilter: MatButtonToggleGroup;
  CRAFT_AREA_ICONS = CRAFT_AREA_ICONS;
  CRAFT_AREAS = Object.keys(CRAFT_AREA_ICONS);

  constructor(database: RecipesDatabase, private localization: LocalizationService, public perks: PerksService) {
    this.treeControl = new DynamicFlatTreeControl<RecipeItem>();
    this.dataSource = new DynamicDataSource(this.treeControl, database);
    this.dataSource.data = database.initialData();
    this.dataSource.filterChange.subscribe(value => console.log('filterChange', value));
    this.dataSource.filterPredicate = (recipeItem: RecipeItem, filter) => {
      // Name filter
      const nameFiltered = filter === FORCE_FILTER
        || recipeItem.item.name.toLowerCase().indexOf(filter) !== -1 // Without translation
        || this.localization.translate(recipeItem.item.name).toLowerCase().indexOf(filter) !== -1;
      return nameFiltered
        && (!recipeItem.recipe.craftArea || this.craftAreaFilter.value.includes(recipeItem.recipe.craftArea))
      ;
    };
  }

  hasChildren = (_: number, nodeData: DynamicFlatNode<RecipeItem>) => nodeData.hasChildren;

  ngOnInit(): void {
    this.dataSource.itemExpanded.subscribe(item => item && this.summary.remove(item));
    this.dataSource.itemCollapsed.subscribe(item => item && this.summary.push(item));
    this.dataSource.itemsAppeared.subscribe(nodes => nodes.forEach(node => this.summary.push(node)));
    this.dataSource.itemsDisappeared.subscribe(nodes => nodes.forEach(node => this.summary.remove(node)));
  }

  applyFilter(name: string = FORCE_FILTER): void {
    // Angular Material does not detect change from undefined to something
    name = name || FORCE_FILTER;
    this.dataSource.filter = name.trim().toLowerCase();
  }

  reapplyFilter() {
    this.applyFilter(this.dataSource.filter);
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

  getCraftAreaIcon(craftArea: string) {
    return CRAFT_AREA_ICONS[craftArea];
  }
}
