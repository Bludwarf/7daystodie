import {Injectable} from '@angular/core';
import {ObjectsCache, XmlService} from '../common/xml.service';
import {Block, Drop} from './block';
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
  getDropsToGet(dropName: string): Drop[] {
    return this.getBlocksToGetCache.getOrPut(dropName, () => {
      const drops = [];
      this.getAll(block =>
        block.getDropsToGet(dropName).forEach(
          drop => drops.push(drop)
        )
      );
      return drops;
    });
  }
}
