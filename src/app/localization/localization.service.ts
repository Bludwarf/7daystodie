import {Injectable} from '@angular/core';
import TOKENS from 'src/assets/Data/Config/Localization.txt.json';
import INTERAL_TOKENS from 'src/assets/Localization.csv.json';
import {WIKI_URL} from '../constants';

export const ENGLISH_LANG = 'English';
export const FRENCH_LANG = 'French';

const getCurrentLanguage = (): string => {
  if (navigator.language.startsWith('fr')) {
    return FRENCH_LANG;
  }
  return ENGLISH_LANG;
};
const DEFAULT_LANG = getCurrentLanguage();

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

  constructor() { }

  translate(key: string, lang = DEFAULT_LANG): string {
    return translate(key, lang);
  }

  getWikiUrl(itemName: string): string {
    return WIKI_URL + encodeURI(this.translate(itemName, ENGLISH_LANG));
  }

  /**
   * @return translated description or translated name if not found
   */
  describe(itemName: string, lang = DEFAULT_LANG): string {
    const key = itemName + 'Desc';
    const desc = translate(key, lang);
    return desc !== key ? desc : translate(itemName, lang);
  }
}
