import {ident, XmlObject} from '../common/xml.service';
import {Interval} from '../common/interval';

export class Block extends XmlObject {
  get dropList(): Drop[] {
    return this.getChildren('drop', Drop);
  }

  get dropListAfterHarvest(): Drop[] {
    return this.dropList.filter(drop => drop.event === Drop.EVENT_HARVEST);
  }

  getDropToHarvest(dropName: string): Drop {
    const drops = this.dropListAfterHarvest.filter(drop => drop.name === dropName);
    if (drops.length > 1) {
      console.warn(`Drop list to harvest "${dropName}" from block "${this.name}" counts ${drops.length} which is bigger than the only one expected`);
    }
    return drops[0];
  }
}

export class Drop extends XmlObject {

  public static EVENT_HARVEST = 'Harvest';
  private _count: Interval;

  get event(): string {
    return this.xmlElement.$.event;
  }

  get name(): string {
    return this.xmlElement.$.name;
  }

  get count(): Interval {
    if (!this._count) {
      this._count = Interval.fromString(this.xmlElement.$.count);
    }
    return this._count;
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

