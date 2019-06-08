import {XmlObject} from '../common/xml.service';

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

  get event(): string {
    return this.xmlElement.$.event;
  }

  get name(): string {
    return this.xmlElement.$.name;
  }

  get count(): number {
    return +this.xmlElement.$.count;
  }

  get tag(): string {
    return this.xmlElement.$.tag;
  }

  get prob(): number {
    return +this.xmlElement.$.prob;
  }

  get stickChance(): number {
    return +this.xmlElement.$.stick_chance;
  }
}
