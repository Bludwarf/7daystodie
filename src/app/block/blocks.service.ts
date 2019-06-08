import { Injectable } from '@angular/core';
import {ObjectsCache, XmlService} from '../common/xml.service';
import {Block} from './block';
import xmlFile from 'src/assets/Data/Config/blocks.xml.json';

@Injectable({
  providedIn: 'root'
})
export class BlocksService extends XmlService<Block> {

  private getBlocksToGetCache = new ObjectsCache<Block[]>();

  constructor() {
    super(xmlFile.blocks.block);
  }

  newElement(xmlElement: any): Block {
    return new Block(xmlElement);
  }

  /**
   * @return All the blocks where one can harvest the requested item
   */
  getBlocksToGet(dropName: string): Block[] {
    return this.getBlocksToGetCache.getOrPut(dropName, () =>
      this.getAll(block => block.getDropToGet(dropName) !== undefined)
    );
  }
}
