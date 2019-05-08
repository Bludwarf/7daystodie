import {XmlObject} from '../common/xml.service';

export class PassiveEffect extends XmlObject {
  constructor(xml) {
    super(xml);
  }

  get operation(): Operation {
    return Operation[this.$.operation as string];
  }

  // TODO gérer number et number[]
  get value(): string {
    if (this.operation !== Operation.base_set) {
      throw new LinkedElementNotSedError(`Cannot get value with "${Operation[this.operation]}" operation`);
    }
    return this.$.value;
  }

}

export enum Operation {
  base_set,
  perc_add
}

export class LinkedElementNotSedError extends Error {
  constructor(m: string) {
    super(m);
  }
}
