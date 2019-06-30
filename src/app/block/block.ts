import {Interval} from '../common/interval';
import {XmlObject} from '../common/xml-object';
import {XmlTopObject} from '../common/xml-top-object';

export class Block extends XmlTopObject {
  get dropList(): Drop[] {
    return this.getChildren('drop', Drop, drop => drop.block = this);
  }

  getDropsToGet(dropName: string): Drop[] {
    return this.dropList.filter(drop => drop.name === dropName);
  }

  get UpgradeBlock(): UpgradeBlock {
    return this.getFirstWithClass<UpgradeBlock>('property', 'UpgradeBlock', UpgradeBlock);
  }

  get RepairItems(): RepairItems {
    return this.getFirstWithClass<RepairItems>('property', 'RepairItems', RepairItems);
  }
}

export class UpgradeBlock extends XmlObject {
  constructor(protected xmlElement: any) {
    super(xmlElement);
  }

  get toBlock(): string {
    return this.getPropertyValue('ToBlock');
  }

  get item(): string {
    return this.getPropertyValue('Item');
  }
}

export class RepairItems extends XmlObject {
  constructor(protected xmlElement: any) {
    super(xmlElement);
  }

  /**
   * @param itemName item name
   * @return quantity of this item needed to repair, undefined if item does not appear in repair items
   */
  get(itemName: string): number {
    const value = this.getPropertyValue(itemName);
    return value !== undefined ? +value : undefined;
  }
}

export class Drop extends XmlObject {

  public static EVENT_DESTROY = 'Destroy';
  public static EVENT_FALL = 'Fall';
  public static EVENT_HARVEST = 'Harvest';
  public block: Block;
  private countCache: Interval;

  get event(): string {
    return this.xmlElement.$.event;
  }

  get name(): string {
    return this.xmlElement.$.name;
  }

  get count(): Interval {
    if (!this.countCache) {
      this.countCache = Interval.fromString(this.xmlElement.$.count);
    }
    return this.countCache;
  }

  get tag(): string {
    return this.xmlElement.$.tag;
  }

  get prob(): number {
    return this.xmlElement.$.prob ? +this.xmlElement.$.prob : 1;
  }

  get stickChance(): number {
    return +this.xmlElement.$.stick_chance;
  }
}

