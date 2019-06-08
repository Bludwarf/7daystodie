import {ident, XmlObject} from '../common/xml.service';
import {Interval} from '../common/interval';

export class Block extends XmlObject {
  get dropList(): Drop[] {
    return this.getChildren('drop', Drop);
  }

  getDropToGet(dropName: string): Drop {
    const drops = this.dropList.filter(drop => drop.name === dropName);
    if (drops.length > 1) {
      console.warn(`Drop list to get "${dropName}" from block "${this.name}" counts ${drops.length} which is bigger than the only one expected`);
    }
    return drops[0];
  }
}

export class Drop extends XmlObject {

  public static EVENT_DESTROY = 'Destroy';
  public static EVENT_FALL = 'Fall';
  public static EVENT_HARVEST = 'Harvest';
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

