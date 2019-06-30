const CACHE_LOGS = false;

const ident = (object) => object;

export class ObjectsCache<T> {
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

export class ObjectsCache2<T> {
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

export class XmlObject {

  private firstCache = new ObjectsCache2<XmlObject>();
  private firstWithClassCache = new ObjectsCache2<XmlObject>();
  private childrenCache = new ObjectsCache<XmlObject[]>();
  parent: XmlObject;

  constructor(protected xmlElement: any) {
  }

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

  static assign<T extends XmlObject, X>(parent: T, xmlElement: X): X {
    XmlObject.mergeInto(parent.xmlElement, xmlElement);
    return xmlElement;
  }

  static mergeInto<T>(parent, child) {
    for (const key in parent) {
      if (parent.hasOwnProperty(key)) {
        const parentValue = parent[key];

        // Arrays
        if (Array.isArray(parentValue)) {
          // It seems that only property element are extended
          if (key === 'property') {
            if (!child.hasOwnProperty(key)) {
              child[key] = parentValue;
            } else {
              // Group property elements by name attribute
              const parentProperties: Map<string, any> = this.getPropertiesByNameOrClass(parentValue);
              const childValue = child[key];
              const childProperties: Map<string, any> = this.getPropertiesByNameOrClass(childValue);
              child[key] = XmlObject.mergePropertiesInto(parentProperties, childProperties);
            }
          }
        }
      }
    }
  }

  private static mergePropertiesInto(parentProperties: Map<string, any>, childProperties: Map<string, any>): any {
    const properties = [];
    parentProperties.forEach((parentProperty, name) => {
      const childProperty = childProperties.get(name);
      if (!childProperty) {
        // Property not found in child
        properties.push(parentProperty);
      } else {
        // Property found in child -> merge
        XmlObject.mergeInto(parentProperty, childProperty);
        properties.push(childProperty);
      }
    });
    // Add child only properties
    childProperties.forEach((childProperty, name) => {
      if (!parentProperties.get(name)) {
        properties.push(childProperty);
      }
    });
    return properties;
  }

  private static getPropertiesByNameOrClass(properties: any[]) {
    return properties.reduce((map: Map<string, any>, property) => {
      map.set(property.$.name || property.$.class, property);
      return map;
    }, new Map());
  }

  /**
   * @param xmlTag nom de l'élément XML fils
   * @param name valeur de l'attribut name des fils à rechercher
   * @param xmlObjectClass classe utilisée pour construire l'élément trouvé (ça devrait être en fait le type de retour de cette méthode)
   */
  getFirst<T extends XmlObject>(xmlTag: string, name: string, xmlObjectClass = XmlObject): T {
    return this.firstCache.getOrPut(xmlTag, name, () => {
      if (!(xmlTag in this.xmlElement)) {
        return undefined;
      }
      const firstChild = this.xmlElement[xmlTag].find(child => child.$ && child.$.name === name);
      return firstChild ? new xmlObjectClass(firstChild) : undefined;
    }) as T;
  }

  /**
   * @param xmlTag nom de l'élément XML fils
   * @param className valeur de l'attribut className des fils à rechercher
   * @param xmlObjectClass classe utilisée pour construire l'élément trouvé (ça devrait être en fait le type de retour de cette méthode)
   */
  getFirstWithClass<T extends XmlObject>(xmlTag: string, className: string, xmlObjectClass = XmlObject): T {
    return this.firstWithClassCache.getOrPut(xmlTag, className, () => {
      if (!(xmlTag in this.xmlElement)) {
        return undefined;
      }
      const firstChild = this.xmlElement[xmlTag].find(child => child.$ && child.$.class === className);
      return firstChild ? new xmlObjectClass(firstChild) : undefined;
    }) as T;
  }

  /**
   * @param xmlTag nom de l'élément XML fils
   * @param xmlObjectClass classe utilisée pour construire l'élément trouvé (ça devrait être en fait le type de retour de cette méthode)
   */
  getChildren<T extends XmlObject>(xmlTag: string, xmlObjectClass = XmlObject, after?: (T, index: number) => void): T[] {
    return this.childrenCache.getOrPut(xmlTag, () => {
      if (!(xmlTag in this.xmlElement)) {
        return [];
      }
      const children = this.xmlElement[xmlTag];
      if (!children) {
        return undefined;
      }
      const childrenObjects = children.map(child => new xmlObjectClass(child));
      if (after) {
        childrenObjects.forEach((childObject, index) => after(childObject, index));
      }
      return childrenObjects;
    }) as T[];
  }

  get $() {
    return this.xmlElement.$;
  }

  get name() {
    return this.$.name;
  }

  get value(): string {
    return this.$.value;
  }

  compareTo<T extends XmlObject>(other: T, translateFunction: (key: string) => string = ident): number {
    const thisName = translateFunction(this.name).toLocaleLowerCase();
    const otherName = translateFunction(other.name).toLocaleLowerCase();
    return thisName.localeCompare(otherName);
  }

  getPropertyValue(name: string): string {
    const property = this.getFirst('property', name);
    return property && property.$ ? property.$.value : undefined;
  }
}

abstract class XmlMap<V> extends XmlObject implements Map<string, V> {

  abstract parseValue(value: string): V;

  * [Symbol.iterator](): IterableIterator<[string, V]> {
    const children = this.getChildren('property');
    for (const child of children) {
      yield [child.name, this.parseValue(child.value)];
    }
  }

  clear(): void {
    // NOP
  }

  delete(key: string): boolean {
    // NOP
    return false;
  }

  * entries(): IterableIterator<[string, V]> {
    yield* this;
  }

  forEach(callbackfn: (value: V, key: string, map: Map<string, V>) => void, thisArg?: any): void {
    // TODO thisArg ?
    for (const [key, value] of this) {
      callbackfn(value, key, this);
    }
  }

  get(key: string): V | undefined {
    const value = this.getPropertyValue(key);
    return value ? this.parseValue(value) : undefined;
  }

  has(key: string): boolean {
    return this.getFirst('property', key) !== undefined;
  }

  * keys(): IterableIterator<string> {
    for (const [key, value] of this) {
      yield key;
    }
  }

  set(key: string, value: V): this {
    // NOP
    return this;
  }

  * values(): IterableIterator<V> {
    for (const [key, value] of this) {
      yield value;
    }
  }

  get size(): number {
    return this.getChildren('property').length;
  }

  get [Symbol.toStringTag]() {
    return 'XmlMap';
  }
}

export class XmlMapOfNumbers extends XmlMap<number> {
  parseValue(value: string): number {
    return +value;
  }

  get(key: string): number | undefined {
    const value = this.getPropertyValue(key);
    return value !== undefined ? +value : undefined;
  }
}
