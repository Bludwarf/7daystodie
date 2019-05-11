import {XmlObject} from '../common/xml.service';

export class ItemModifier extends XmlObject {
  constructor(xmlElement: any) {
    super(xmlElement);
  }

  get installableTags(): string[] {
    return this.$.installable_tags.split(',');
  }
}
