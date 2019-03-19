export abstract class XmlService<T> {

  protected cache = new XmlObjectsCache<T>();

  /**
   *
   * @param xmlElements example : xmlFiles.items.item
   */
  constructor(protected xmlElements: any[]) { }

  /**
   * @param name item's name. Example : "gunPistol"
   * @return undefined it not found
   */
  get(name: string): T {
    return this.cache.getOrPut(name, () => {
      const xmlElement = this.xmlElements.find(xmlElement => xmlElement.$.name === name);
      return xmlElement ? this.newElement(xmlElement) : undefined;
    });
  }

  getAll(filter: (element: T) => boolean = undefined): T[] {
    return this.cache.getOrPutAll(element => element.name, () => {
      return this.xmlElements
        .map(xmlElement => this.newElement(xmlElement))
        .filter(element => !filter || filter(element));
    });
  }

  abstract newElement(xmlElement: any): T;
}

export class XmlObject {

  private firstCache = new XmlObjectsCache2<XmlObject>();
  private firstWithClassCache = new XmlObjectsCache2<XmlObject>();

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

}

export class XmlObjectsCache<T> {
  cache = {};

  /** To keep order */
  keys = [];

  /** all items have been read ? */
  hasAll = false;

  has(key: string): boolean {
    return this.keys.includes(key);
  }

  get(key: string): T {
    return this.cache[key];
  }

  getOrPut(key: string, createItem: () => T): T {
    if (!this.has(key)) {
      console.log(`CACHE : create element at key ${key}`);
      this.put(key, createItem());
    }
    return this.cache[key];
  }

  put(key: string, item: T): void {
    this.cache[key] = item;
    this.keys.push(key);
  }

  getOrPutAll(getKey: (T) => string, createAllItems: () => T[]): T[] {
    if (!this.hasAll) {
      console.log(`CACHE : create all elements`);
      createAllItems().forEach(item => this.put(getKey(item), item));
    }
    return this.keys.map(key => this.cache[key]);
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
