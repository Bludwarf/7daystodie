import {Injectable} from '@angular/core';
import {ObjectsCache, XmlService} from '../common/xml.service';
import {Block, Drop} from './block';
import xmlFile from 'src/assets/Data/Config/blocks.xml.json';

@Injectable({
  providedIn: 'root'
})
export class BlocksService extends XmlService<Block> {

  private getDropsToGetCache = new ObjectsCache<Drop[]>();

  constructor() {
    super(xmlFile.blocks.block);
  }

  newElement(xmlElement: any): Block {
    return new Block(xmlElement);
  }

  get xmlFile(): string {
    return 'Data/Config/blocks.xml';
  }

  /**
   * @return All the blocks where one can harvest the requested item
   */
  getDropsToGet(dropName: string): Drop[] {
    return this.getDropsToGetCache.getOrPut(dropName, () => {
      const drops: Drop[] = [];
      this.getAll().forEach(block =>
        block.getDropsToGet(dropName).forEach(
          drop => drops.push(drop)
        )
      );
      return drops;
    });
  }
}
