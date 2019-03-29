import {Injectable} from '@angular/core';
import {parseString} from 'xml2js';
import xmlFile from 'src/assets/Data/Config/items.xml.json';
import itemIconsFile from 'src/assets/ItemIcons/index.json';
import {XmlObject, XmlObjectsCache, XmlService} from '../common/xml.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends XmlService<Item> {

  private requiredItemCache = new XmlObjectsCache<Item>();

  constructor() {
    super(xmlFile.items.item);
  }

  newElement(xmlElement: any): Item {
    return new Item(xmlElement);
  }

  /**
   * @return the item required by cvar to craft this item
   */
  getRequiredItem(item: Item): Item {
    return this.requiredItemCache.getOrPut(item.name, () =>
      this.getAll().find(itemI => itemI.settedCvars.includes(item.name))
    );
  }

  /**
   * @return the icon path only if it exists, undefined otherwise
   */
  getExistingItemIcon(itemName: string): string {
    const filename = `${itemName}.png`;
    return itemIconsFile.includes(filename) ? this.getItemIcon(itemName) : undefined;
  }

  getItemIcon(itemName: string): string {
    return `assets/ItemIcons/${itemName}.png`;
  }
}

export enum Operation {
  base_set = 'base_set',
  base_add = 'base_add',
  perc_add = 'perc_add',
  base_subtract = 'base_subtract'
}

export class Item extends XmlObject {

  private _settedCvars: string[] = undefined;

  constructor(xml: any) {
    super(xml);
  }

  get Groups(): string[] {
    const group = this.getFirst('property', 'Group');
    return group ? group.$.value.split(',') : undefined;
  }

  get BaseEffects(): XmlObject {
    return this.getFirst('effect_group', 'Base Effects');
  }

  getPassiveEffect(name: string): XmlObject {
    const effectGroup = this.BaseEffects;
    if (!effectGroup) {
      // console.error('no effect_group for ' + this.name);
      return undefined;
    }

    return effectGroup.getFirst('passive_effect', name);
  }

  getPassiveEffectValue(name: string): number {
    const passiveEffect = this.getPassiveEffect(name);
    if (!passiveEffect) {
      // console.error('no passive_effect for ' + this.name);
      return undefined;
    }

    return +passiveEffect.$.value;
  }

  get MaxRange(): number {
    return this.getPassiveEffectValue('MaxRange');
  }

  getPassiveEffectFromBase(name: string, base: Item): number {
    const entityDamage = this.getPassiveEffect(name);
    if (!entityDamage) {
      return +base.getPassiveEffect(name).$.value;
    }
    let value = +entityDamage.$.value;

    // base_set
    if (entityDamage.$.operation === Operation.base_set) {
      return value;
    }

    if (entityDamage.$.operation === Operation.perc_add
      || entityDamage.$.operation === Operation.base_add
      || entityDamage.$.operation === Operation.base_subtract) {
      if (!base) {
        throw new Error(`Cannot get "${name}" without magazineItem for Item "${this.name}"`);
      }
      const baseValue = +base.getPassiveEffect(name).$.value;
      if (entityDamage.$.operation === Operation.perc_add || entityDamage.$.operation === Operation.base_add) {
        value = baseValue + value;
      } else if (entityDamage.$.operation === Operation.base_subtract) {
        value = baseValue - value;
      }
    }

    return value;
  }

  getMaxRange(magazineItem?: Item): number {
    return this.getPassiveEffectFromBase('MaxRange', magazineItem);
  }

  get DamageFalloffRange(): number {
    return this.getPassiveEffectValue('DamageFalloffRange');
  }

  getDamageFalloffRange(magazineItem?: Item): number {
    return this.getPassiveEffectFromBase('DamageFalloffRange', magazineItem);
  }

  get DegradationPerUse(): number {
    return this.getPassiveEffectValue('DegradationPerUse');
  }

  get RoundsPerMinute(): number {
    return this.getPassiveEffectValue('RoundsPerMinute');
  }

  get EntityDamage(): number {
    return this.getPassiveEffectValue('EntityDamage');
  }

  getEntityDamage(magazineItem?: Item): number {
    return this.getPassiveEffectFromBase('EntityDamage', magazineItem);
  }

  get MagazineSize(): number {
    return this.getPassiveEffectValue('MagazineSize');
  }

  get MagazineItemNames(): string[] {
    const action0 = this.getFirstWithClass('property', 'Action0');
    if (!action0) {
      return undefined;
    }

    const magazineItems = action0.getFirst('property', 'Magazine_items');
    if (!magazineItems) {
      return undefined;
    }

    if (!magazineItems.$.value) {
      return undefined;
    }
    return magazineItems.$.value.split(/ *, */);
  }

  getDegradationMax(tier: number): number {
    const degradationMax = this.getPassiveEffect('DegradationMax');
    if (!degradationMax) {
      return undefined;
    }

    const valueAttribute = degradationMax.$.value;
    const tierAttribute = degradationMax.$.tier;
    return XmlObject.interpolateStrings(valueAttribute, tierAttribute, tier);
  }

  /**
   * @return max uses before repair/break
   */
  getMaxUses(tier: number): number {
    const degradationMax = this.getDegradationMax(tier);
    if (!degradationMax) {
      return undefined;
    }

    const degradationPerUse = this.DegradationPerUse;
    if (!degradationPerUse) {
      return undefined;
    }

    return degradationMax / degradationPerUse;
  }

  get customIcon(): string {
    const xmlProp = this.getFirst('property', 'CustomIcon');
    return xmlProp ? xmlProp.$.value : undefined;
  }

  get customIconTint(): string {
    const xmlProp = this.getFirst('property', 'CustomIconTint');
    return xmlProp ? xmlProp.$.value : undefined;
  }

  /**
   * Example :
   * <pre>
   *     <effect_group tiered="false">
   *         <triggered_effect trigger="onSelfPrimaryActionEnd" action="ModifyCVar" cvar="drinkJarBeer" operation="set" value="1"/>
   *     </effect_group>
   * </pre>
   */
  get settedCvars(): string[] {
    if (!this._settedCvars) {
      let triggeredEffects = [];
      if (this.xmlElement.effect_group) {
        this.xmlElement.effect_group.forEach(effectGroup => {
          if (effectGroup.triggered_effect) {
            triggeredEffects = triggeredEffects.concat(effectGroup.triggered_effect
              .filter(triggeredEffect => triggeredEffect.$.action === 'ModifyCVar'
                && triggeredEffect.$.operation === 'set'
                && triggeredEffect.$.value === '1'));
          }
        });
      }
      this._settedCvars = triggeredEffects.map(triggeredEffect => triggeredEffect.$.cvar);
    }
    return this._settedCvars;
  }
}
