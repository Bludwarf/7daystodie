import {Injectable} from '@angular/core';
import {parseString} from 'xml2js';
import xmlFile from 'src/assets/Data/Config/items.xml.json';
import {interpolate} from '@angular/core/src/view';
import {WIKI_URL} from '../../constants';
import {LocalizationService} from './localization.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private itemsByName = new XmlObjectsCache<Item>();

  constructor() { }

  /**
   * @param name item's name. Example : "gunPistol"
   * @return undefined it not found
   */
  get(name: string): Item {
    return this.itemsByName.getOrPut(name, () => {
      const itemXml = xmlFile.items.item.find(item => item.$.name === name);
      return itemXml ? new Item(itemXml) : undefined;
    });
  }

  getAll(filter: (item: Item) => boolean = undefined): Item[] {
    return this.itemsByName.getOrPutAll(item => item.name, () => {
      return xmlFile.items.item
        .map(xmlElement => new Item(xmlElement))
        .filter(item => !filter || filter(item));
    });
  }
}

export class XmlObjectsCache<T> {
  cache = {};

  /** all items have been read ? */
  hasAll = false;

  has(key: string): boolean {
    return key in this.cache;
  }

  get(key: string): T {
    return this.cache[key];
  }

  getOrPut(key: string, createItem: () => T): T {
    if (!this.has(key)) {
      console.log(`CACHE : create element at key ${key}`);
      this.cache[key] = createItem();
    }
    return this.cache[key];
  }

  put(key: string, item: T): void {
    this.cache[key] = item;
  }

  getOrPutAll(getKey: (T) => string, createAllItems: () => T[]): T[] {
    if (!this.hasAll) {
      console.log(`CACHE : create all elements`);
      createAllItems().forEach(item => this.put(getKey(item), item));
    }
    return Object.keys(this.cache)
      .map(key => this.cache[key]);
  }
}

export class XmlObjectsCache2<T> {
  cache = {};

  /**
   * Allows to call directly this.cache[key1][key2]
   */
  autoCreate(key1: string): boolean {
    if (!(key1 in this.cache)) {
      this.cache[key1] = {};
      return true;
    }
    return false;
  }

  has(key1: string, key2: string): boolean {
    this.autoCreate(key1);
    return key2 in this.cache[key1];
  }

  get(key1: string, key2: string): T {
    this.autoCreate(key1);
    return this.cache[key1][key2];
  }

  getOrPut(key1: string, key2: string, createItem: () => T): T {
    this.autoCreate(key1);
    if (!this.has(key1, key2)) {
      console.log(`CACHE : create element at keys ${key1},${key2}`);
      this.cache[key1][key2] = createItem();
    }
    return this.cache[key1][key2];
  }
}

export class XmlObject {

  private firstCache = new XmlObjectsCache2<XmlObject>();

  constructor(protected xmlElement: any) { }

  static interpolateStrings(minMaxValue: string, minMaxTier: string, tier: number): number {
    return XmlObject.interpolate(
      minMaxValue.split(',').map(string => +string),
      minMaxTier.split(',').map(string => +string),
      tier);
  }

  static interpolate(minMaxValue: number[], minMaxTier: number[], tier: number): number {
    const [minValue, maxValue] = minMaxValue;
    const [minTier, maxTier] = minMaxTier;

    if (tier === minTier) {
      return minValue;
    }
    if (tier === maxTier) {
      return maxValue;
    }
    return minValue + tier / (maxTier - minTier) * (maxValue - minValue);
  }

  getFirst(xmlTag: string, name: string): XmlObject {
    return this.firstCache.getOrPut(xmlTag, name, () => {
      if (!(xmlTag in this.xmlElement)) {
        return undefined;
      }
      const firstChild = this.xmlElement[xmlTag].find(child => child.$ && child.$.name === name);
      return firstChild ? new XmlObject(firstChild) : undefined;
    });
  }

  get $() {
    return this.xmlElement.$;
  }

  get name() {
    return this.$.name;
  }

}

export class Item extends XmlObject {
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

  get DamageFalloffRange(): number {
    return this.getPassiveEffectValue('DamageFalloffRange');
  }

  get DegradationPerUse(): number {
    return this.getPassiveEffectValue('DegradationPerUse');
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
}
