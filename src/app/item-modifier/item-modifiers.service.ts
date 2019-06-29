import { Injectable } from '@angular/core';
import {XmlService} from '../common/xml.service';
import xmlFile from 'src/assets/Data/Config/item_modifiers.xml.json';
import {ItemModifier} from './item-modifier';
import {Item} from '../items/items.service';

@Injectable({
  providedIn: 'root'
})
export class ItemModifiersService extends XmlService<ItemModifier> {

  constructor() {
    super(xmlFile.item_modifiers.item_modifier);
  }

  newElement(xmlElement: any): ItemModifier {
    return new ItemModifier(xmlElement);
  }

  get xmlFile(): string {
    return 'Data/Config/item_modifiers.xml';
  }

  getAllModsInstallableOn(item: Item): ItemModifier[] {
    return this.getAll().filter(mod => mod.isInstallableOn(item));
  }
}
