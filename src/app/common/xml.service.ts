const CACHE_LOGS = false;
import * as _ from 'underscore';

export abstract class XmlService<T extends XmlObject> {

  protected cache = new XmlObjectsCache<T>();

  /**
   *
   * @param xmlElements example : xmlFiles.items.item
   */
  protected constructor(protected xmlElements: any[]) { }

  /**
   * @param name item's name. Example : "gunPistol"
   * @return undefined it not found
   */
  get(name: string): T {
    return this.cache.getOrPut(name, () => {
      const elements = this.xmlElements
        .filter(xmlElementI => xmlElementI.$.name === name)
        .map(xmlElement => xmlElement ? this.newElement(xmlElement) : undefined);
      if (elements.length <= 1) {
        return elements.length ? elements[0] : undefined;
      } else {
        return this.handleDuplicates(elements);
      }
    });
  }

  getAll(filter?: (element: T) => boolean): T[] {
    return this.cache.getOrPutAll(element => element.name, () => {
      const elements = this.xmlElements
        .map(xmlElement => this.newElement(xmlElement));
      const elementsByName = _.groupBy(elements, 'name');
      return Object.keys(elementsByName)
        .map(name => {
          const duplicates = elementsByName[name];
          if (duplicates.length <= 1) {
            return duplicates.length ? duplicates[0] : undefined;
          } else {
            return this.handleDuplicates(duplicates);
          }
        })
        .filter(element => !!element); // handleDuplicates may return undefined
    })
      .filter(element => !filter || filter(element));
  }

  abstract newElement(xmlElement: any): T;

  /**
   * @elements contains at least two elements that share the same name
   * @return element to keep between duplicates, undefined if no element show be kept
   */
  handleDuplicates(elements: T[]): T {
    return elements.length ? elements[0] : undefined;
  }
}

export class XmlObject {

  private firstCache = new XmlObjectsCache2<XmlObject>();
  private firstWithClassCache = new XmlObjectsCache2<XmlObject>();

  constructor(protected xmlElement: any) { }

  static interpolateStrings(minMaxValue: string, minMaxTier: string, tier: number): number {
    return XmlObject.interpolate(
      minMaxValue.split(',').map(value => +value),
      minMaxTier.split(',').map(tierString => +tierString),
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

  getFirstWithClass(xmlTag: string, className: string): XmlObject {
    return this.firstWithClassCache.getOrPut(xmlTag, className, () => {
      if (!(xmlTag in this.xmlElement)) {
        return undefined;
      }
      const firstChild = this.xmlElement[xmlTag].find(child => child.$ && child.$.class === className);
      return firstChild ? new XmlObject(firstChild) : undefined;
    });
  }

  get $() {
    return this.xmlElement.$;
  }

  get name() {
    return this.$.name;
  }

  compareTo<T extends XmlObject>(other: T, translateFunction: (key: string) => string): number {
    const thisName = translateFunction(this.name).toLocaleLowerCase();
    const otherName = translateFunction(other.name).toLocaleLowerCase();
    return thisName.localeCompare(otherName);
  }

}

export class XmlObjectsCache<T> {
  cache = {};

  /** To keep ordre and know if all items have been read */
  all: T[] = undefined;

  has(key: string): boolean {
    return key in this.cache;
  }

  get(key: string): T {
    return this.cache[key];
  }

  getOrPut(key: string, createItem: () => T): T {
    if (!this.has(key)) {
      if (CACHE_LOGS) {
        console.log(`CACHE : create element at key ${key}`);
      }
      this.put(key, createItem());
    }
    return this.cache[key];
  }

  put(key: string, item: T): void {
    this.cache[key] = item;
  }

  getOrPutAll(getKey: (T) => string, createAllItems: () => T[]): T[] {
    if (!this.all) {
      if (CACHE_LOGS) {
        console.log(`CACHE : create all elements`);
      }
      this.all = createAllItems().map(item => this.get(getKey(item)) || item);
      this.all.forEach(item => this.put(getKey(item), item));
    }
    return this.all;
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
      if (CACHE_LOGS) {
        console.log(`CACHE : create element at keys ${key1},${key2}`);
      }
      this.cache[key1][key2] = createItem();
    }
    return this.cache[key1][key2];
  }
}
