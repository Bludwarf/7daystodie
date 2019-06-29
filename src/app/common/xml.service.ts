import {el} from '@angular/platform-browser/testing/src/browser_util';

const CACHE_LOGS = false;
import * as _ from 'underscore';

export abstract class XmlService<T extends XmlObject> {

  protected cache = new ObjectsCache<T>();

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
        .map(xmlElement => xmlElement ? this.newElement0(xmlElement) : undefined);
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
        .map(xmlElement => this.newElement0(xmlElement));
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

  /**
   * Internal creation of XmlElement
   * @param xmlElement
   */
  private newElement0(xmlElement: any): T {

    // Right before creation, check if this element extends an other
    if (xmlElement.property) {
      const extendsElement = xmlElement.property.find(property => property.$.name === 'Extends');
      if (extendsElement) {
        const parentName = extendsElement.$ ? extendsElement.$.value : undefined;
        const parent = this.get(parentName);
        if (!parent) {
          throw new Error(`Cannot find "${parentName}" which is the parent of "${xmlElement.$ ? xmlElement.$.name : xmlElement}" in ${this.xmlFile}`);
        }

        // Replace xmlElement data before any usage
        xmlElement = XmlObject.assign(parent, xmlElement);
      }
    }

    return this.newElement(xmlElement);
  }

  abstract newElement(xmlElement: any): T;

  /**
   * Path (relative to "assets" folder) of the source xml file for this service.
   * Example : 'Data/Config/items.xml'
   */
  abstract get xmlFile(): string;

  /**
   * @elements contains at least two elements that share the same name
   * @return element to keep between duplicates, undefined if no element show be kept
   */
  handleDuplicates(elements: T[]): T {
    return elements.length ? elements[0] : undefined;
  }
}

export const ident = (object) => object;

export class XmlObject {

  private firstCache = new ObjectsCache2<XmlObject>();
  private firstWithClassCache = new ObjectsCache2<XmlObject>();
  private childrenCache = new ObjectsCache<XmlObject[]>();
  parent: XmlObject;

  constructor(protected xmlElement: any) {}

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
      // It semms that only property element are extended
      if (key === 'property' && parent.hasOwnProperty(key)) {
        const parentValue = parent[key];

        if (Array.isArray(parentValue)) {

          if (!child.hasOwnProperty(key)) {
            child[key] = parentValue;
          } else {
            // Group property elements by name attribute
            const parentProperties: Map<string, any> = this.getPropertiesByName(parentValue);
            const childValue = child[key];
            const childProperties: Map<string, any> = this.getPropertiesByName(childValue);
            child[key] = XmlObject.mergePropertiesInto(parentProperties, childProperties);
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

  private static getPropertiesByName(properties: any[]) {
    return properties.reduce((map: Map<string, any>, property) => {
      map.set(property.$.name, property);
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
