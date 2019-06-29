import * as _ from 'underscore';
import {ObjectsCache, XmlObject} from './xml-object';
import {XmlTopObject} from './xml-top-object';

export abstract class XmlService<T extends XmlTopObject> {

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

