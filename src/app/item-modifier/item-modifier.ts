import {XmlObject} from '../common/xml.service';
import {Item} from '../items/items.service';

export class ItemModifier extends XmlObject {
  constructor(xmlElement: any) {
    super(xmlElement);
  }

  get installableTags(): string[] {
    return this.$.installable_tags.split(',');
  }

  get blockedTags(): string[] {
    return this.$.blocked_tags.split(',');
  }


  isInstallableOn(item: Item) {
    if (ItemModifier.tagsMatch(item.tags, this.installableTags)) {
      return !ItemModifier.tagsMatch(item.tags, this.blockedTags);
    }
    return false;
  }

  /**
   *
   * @param tags
   * @param tags2
   * @param invert false si on veut trouver le 1er qui invert, true si on veut trouver le 1er qui ne invert pas
   * @return true si au moins un tag de tags invert un tag de tags2
   */
  static tagsMatch(tags: string[], tags2: string[]): boolean {
    if (!tags2) {
      return true;
    }
    if (!tags) {
      return false;
    }
    return !!tags.find(tag => !!tags2.find(tag2 => tag2 === tag));
  }
}
