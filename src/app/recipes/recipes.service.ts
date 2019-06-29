import { Injectable } from '@angular/core';
import xmlFile from 'src/assets/Data/Config/recipes.xml.json';
import {XmlService} from '../common/xml.service';
import {XmlObject} from '../common/xml-object';
import {XmlTopObject} from '../common/xml-top-object';

export const CRAFT_AREA_ICONS = {
  campfire: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_campfire.png',
  cementMixer: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_cement.png',
  chemistryStation: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_chemistry.png',
  forge: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_forge.png',
  tableSaw: 'assets/UIAtlasItemIcons/ItemIcons/tableSaw.png',
  workbench: 'assets/UIAtlasItemIcons/ItemIcons/ui_game_symbol_workbench.png'
};

export const CRAFT_TOOLS_CAMPFIRE = [
  'toolCookingPot',
  'toolCookingGrill',
  'toolBeaker'
];

export const CRAFT_TOOLS_FORGE = [
  'toolAnvil',
  'toolForgeCrucible',
  'toolAndDieSet'
];

@Injectable({
  providedIn: 'root'
})
export class RecipesService extends XmlService<Recipe> {

  constructor() {
    super(xmlFile.recipes.recipe);
  }

  newElement(xmlElement: any): Recipe {
    return new Recipe(xmlElement);
  }

  get xmlFile(): string {
    return 'Data/Config/recipes.xml';
  }

  handleDuplicates(elements: Recipe[]): Recipe {
    // TODO wildcard_forge_category
    elements = elements.filter(element => !!element.ingredients);
    if (!elements.length) {
      return undefined;
    }

    const first = elements[0];
    first.siblings = elements.slice(1);
    return first;
  }
}

/** learnable tag */
export const TAG_LEARNABLE = 'learnable';

export class Recipe extends XmlTopObject {

  public siblings: Recipe[] = [];

  constructor(xmlElement) {
    super(xmlElement);
  }

  get count(): number {
    const count = this.xmlElement.$.count;
    return count ? +count : 1;
  }

  get ingredients(): Ingredient[] {
    const ingredients = this.xmlElement.ingredient;
    if (!ingredients) {
      // TODO wildcard_forge_category
      return undefined;
    }
    return ingredients.map(xmlIngredient => new Ingredient(xmlIngredient));
  }

  /**
   * @see TAG_LEARNABLE
   */
  get tags(): string[] {
    return this.$.tags ? this.$.tags.split(/ *, */) : undefined;
  }

  get isLearnable(): boolean {
    const tags = this.tags;
    return tags ? this.tags.includes(TAG_LEARNABLE) : false;
  }

  get craftArea(): string {
    const craftArea = this.$.craft_area;
    // TODO tableSaw is spelled "tablesaw" in recipes.xml
    if (craftArea === 'tablesaw') {
      return 'tableSaw';
    }
    return craftArea;
  }

  get craftTool(): string {
    return this.$.craft_tool;
  }

}

export class Ingredient extends XmlObject {

  constructor(xmlElement) {
    super(xmlElement);
  }

  get count(): number {
    return +this.$.count;
  }
}
