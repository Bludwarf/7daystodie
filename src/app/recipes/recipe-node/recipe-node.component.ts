import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {RecipeItem} from '../recipes.database';
import {RecipesComponent} from '../recipes.component';
import {DynamicFlatNode} from '../../common/dynamic-flat-tree';
import {ItemIconComponent} from '../../items/item-icon/item-icon.component';
import {Item, ItemsService} from '../../items/items.service';
import {PerkLevel, PerksService} from '../../progression/perks.service';
import {LocalizationService} from '../../localization/localization.service';
import {CRAFT_AREA_ICONS} from '../recipes.service';

@Component({
  selector: 'app-recipe-node',
  templateUrl: './recipe-node.component.html',
  styleUrls: ['./recipe-node.component.scss']
})
export class RecipeNodeComponent implements OnInit {

  @Input('node') node: DynamicFlatNode<RecipeItem>;
  @ViewChildren(ItemIconComponent) itemIconComponents: QueryList<ItemIconComponent>;

  constructor(private items: ItemsService, private perks: PerksService, public localization: LocalizationService) { }

  ngOnInit() {
  }

  reload() {
    this.itemIconComponents.forEach(itemIconComponent => itemIconComponent.reload());
  }

  getRequiredItem(recipeItem: RecipeItem): Item {
    if (!recipeItem.item) {
      return undefined;
    }
    return this.items.getRequiredItem(recipeItem.item);
  }

  getRequiredPerkLevelForRecipe(recipeItem: RecipeItem): PerkLevel | undefined {
    const perkLevel = this.perks.getRequiredPerkLevelForRecipe(recipeItem.recipe.name);
    if (!perkLevel) {
      console.error(`Cannot find required PerkLevel for recipe "${recipeItem.recipe.name}"`);
      return undefined;
    }
    return perkLevel;
  }

  perkLevelToString(perkLevel: PerkLevel) {
    const localName = this.localization.translate(perkLevel.name + 'Name');
    return `${localName} ${this.localization.translate('xuiSkillLevel')} ${perkLevel.level}`;
  }

  getCraftAreaIcon(craftArea: string) {
    return CRAFT_AREA_ICONS[craftArea];
  }
}
