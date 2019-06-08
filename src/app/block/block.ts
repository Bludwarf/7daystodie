import {XmlObject} from '../common/xml.service';
import {Interval} from '../common/interval';

export class Block extends XmlObject {
  get dropList(): Drop[] {
    return this.getChildren('drop', Drop);
  }

  get dropListAfterHarvest(): Drop[] {
    return this.dropList.filter(drop => drop.event === Drop.EVENT_HARVEST);
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

