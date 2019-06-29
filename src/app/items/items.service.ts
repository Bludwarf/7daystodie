import {Injectable} from '@angular/core';
import xmlFile from 'src/assets/Data/Config/items.xml.json';
import itemIconsFile from 'src/assets/ItemIcons/index.json';
import {XmlService} from '../common/xml.service';
import {ItemModifier} from '../item-modifier/item-modifier';
import {ObjectsCache, XmlObject} from '../common/xml-object';
import {XmlTopObject} from '../common/xml-top-object';

/** When reload_time not explicitly defined in Action0 */
const HARD_CODED_RELOAD_TIMES: { [key: string]: number } = {
  gunPistol: 2,
  gunAK47: 3.8,
  gunRocketLauncher: 2.7,
  gunWoodenBow: 0.9,
  gunCompoundBow: 2,
  gunCrossbow: 3.4,
};

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends XmlService<Item> {
  private requiredItemCache = new ObjectsCache<Item>();

  constructor() {
    super(xmlFile.items.item);
  }

  newElement(xmlElement: any): Item {
    return new Item(xmlElement);
  }

  get xmlFile(): string {
    return 'Data/Config/items.xml';
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

  getCompatibleItems(mod: ItemModifier): Item[] {
    return this.getAll().filter(item => mod.isInstallableOn(item));
  }
}

export class Item extends XmlTopObject {


  constructor(xml: any) {
    super(xml);
  }

  get MaxRange(): number {
    return this.getPassiveEffectValue('MaxRange');
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

  get BlockDamage(): number {
    return this.getPassiveEffectValue('BlockDamage');
  }

  getBlockDamage(magazineItem?: Item): number {
    return this.getPassiveEffectFromBase('BlockDamage', magazineItem);
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

  get recoil(): number {
    const effectGroup = this.getFirst('effect_group', 'Base Effects');
    if (!effectGroup) {
      return undefined;
    }
    const dRecoil = effectGroup.getFirst('display_value', 'dRecoil');
    if (!dRecoil) {
      return undefined;
    }
    return +dRecoil.$.value;
  }

  get handling(): number {
    return this.getPassiveEffectValue('WeaponHandling');
  }

  get action0(): Action {
    return this.getFirstWithClass<Action>('property', 'Action0', Action);
  }

  get action1(): Action {
    return this.getFirstWithClass<Action>('property', 'Action1', Action);
  }

  /**
   * @return reload time in seconds
   */
  get reloadTime(): number {
    if (!this.action0) {
      return undefined;
    }
    return this.action0.reloadTime || HARD_CODED_RELOAD_TIMES[this.name];
  }
}

export class Action extends XmlObject {
  get reloadTime(): number {
    const reloadTime = this.getFirst('property', 'Reload_time');
    return reloadTime ? +reloadTime.$.value : undefined;
  }

  get vehicle(): string {
    return this.getPropertyValue('Vehicle');
  }

  get class(): string {
    return this.getPropertyValue('Class');
  }
}
