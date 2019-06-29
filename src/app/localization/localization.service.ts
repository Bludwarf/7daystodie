import {Injectable} from '@angular/core';
import TOKENS from 'src/assets/Data/Config/Localization.txt.json';
import INTERAL_TOKENS from 'src/assets/Localization.csv.json';
import {WIKI_URL} from '../constants';
import {XmlObject} from '../common/xml-object';
import {XmlTopObject} from '../common/xml-top-object';
import {NamedAndDescribed} from '../common/interfaces';

export const ENGLISH_LANG = 'English';
export const FRENCH_LANG = 'French';

const getCurrentLanguage = (): string => {
  if (navigator.language.startsWith('fr')) {
    return FRENCH_LANG;
  }
  return ENGLISH_LANG;
};
export const DEFAULT_LANG = getCurrentLanguage();

export const translate = (key: string, lang = DEFAULT_LANG): string => {
  const translations = TOKENS[key] || INTERAL_TOKENS[key];
  if (!translations) {
    return key;
  }
  return translations[lang] || translations[ENGLISH_LANG] || key;
};

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  constructor() {
  }

  translate(key: string, lang = DEFAULT_LANG): string {
    return translate(key, lang);
  }

  getWikiUrl(itemName: string): string {
    return WIKI_URL + encodeURI(this.translate(itemName, ENGLISH_LANG));
  }

  /**
   * @return translated description or translated name if not found
   */
  describe(object: NamedAndDescribed, lang = DEFAULT_LANG): string {
    if (object.descriptionKey) {
      const desc = translate(object.descriptionKey, lang);
      console.log('object.descriptionKey='+object.descriptionKey);
      console.log('desc='+desc);
      if (desc && desc !== object.descriptionKey) {
        return desc;
      }
    }
    console.log('object.name='+object.name);
    return translate(object.name, lang);
  }

  getSortFunction<T extends XmlObject>(): (a: T, b: T) => number {
    return (a, b) => this
      .translate(a.name)
      .localeCompare(this.translate(b.name), undefined, {sensitivity: 'base'});
  }
}
