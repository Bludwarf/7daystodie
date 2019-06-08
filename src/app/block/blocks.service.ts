import { Injectable } from '@angular/core';
import {XmlService} from '../common/xml.service';
import {Block} from './block';
import xmlFile from 'src/assets/Data/Config/blocks.xml.json';

@Injectable({
  providedIn: 'root'
})
export class BlocksService extends XmlService<Block> {

  constructor() {
    super(xmlFile.blocks.block);
  }

  newElement(xmlElement: any): Block {
    return new Block(xmlElement);
  }
}
