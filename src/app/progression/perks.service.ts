import {Injectable} from '@angular/core';
import xmlFile from 'src/assets/Data/Config/progression.xml.json';
import {XmlObject, XmlObjectsCache, XmlService} from '../services/config/xml.service';

@Injectable({
  providedIn: 'root'
})
export class PerksService extends XmlService<Perk> {

  private requiredPerkLevelForRecipeCache = new XmlObjectsCache<PerkLevel>();

  constructor() {
    super(xmlFile.progression.perks[0].perk);
  }

  newElement(xmlElement: any): Perk {
    return new Perk(xmlElement);
  }

  /**
   * Example : getRequiredPerkLevelForRecipe('foodShamChowder') => {
   *     name: "perkMasterChef",
   *     level: 3
   * }
   */
  getRequiredPerkLevelForRecipe(recipeName: string): PerkLevel {
    return this.requiredPerkLevelForRecipeCache.getOrPut(recipeName, () => {
      let foundPerkLevel: PerkLevel;
      this.getAll().find(perk => {
        const matchedPerkLevel = perk.levels.find(perkLevel => perkLevel.recipeTagUnlocked.includes(recipeName));
        if (matchedPerkLevel) {
          foundPerkLevel = matchedPerkLevel;
          return true;
        } else {
          return false;
        }
      });
      // noinspection JSUnusedAssignment
      return foundPerkLevel;
    });
  }
}

export class Perk extends XmlObject {

  private levelsCache = new XmlObjectsCache<PerkLevel>();

  constructor(xmlElement) {
    super(xmlElement);
  }

  get levels(): PerkLevel[] {
    return this.levelsCache.getOrPutAll(perkLevel => perkLevel.level, () => {
      const levelRequirements = this.xmlElement.level_requirements;
      const passiveEffects = this.xmlElement.effect_group[0].passive_effect;
      return [1, 2, 3, 4, 5].map(level => {
        const perkLevel = new PerkLevel(this.name, level);
        perkLevel.levelRequirements = levelRequirements.find(levelRequirement => +levelRequirement.$.level === level).requirement;
        if (passiveEffects) {
          perkLevel.passiveEffects = passiveEffects
            .filter(passiveEffect => +passiveEffect.$.level.split(/ *, */)[0] === level)
            .map(xmlElement => new XmlObject(xmlElement));
        }
        return perkLevel;
      });
    });
  }
}

export class PerkLevel {

  public levelRequirements: any[];
  passiveEffects: XmlObject[];

  constructor(public name: string, public level: number) {
  }

  get recipeTagUnlocked(): string[] {
    if (!this.passiveEffects) {
      return [];
    }
    return this.passiveEffects
      .filter(o => o.$.name === 'RecipeTagUnlocked')
      .map(o => o.$.tags.split(/ *, */))
      .reduce((previousValue, currentValue) => previousValue.concat(currentValue), []);
  }
}
