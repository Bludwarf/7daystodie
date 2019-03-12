import { Injectable } from '@angular/core';
import TOKENS from 'src/assets/Data/Config/Localization.txt.json';
import {WIKI_URL} from '../../constants';
import {Item} from './items.service';

const ENGLISH_LANG = 'English';
const FRENCH_LANG = 'French';
const DEFAULT_LANG = FRENCH_LANG;

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  constructor() { }

  translate(key: string, lang = DEFAULT_LANG): string {
    const translations = TOKENS[key];
    if (!translations) {
      return key;
    }
    return translations[lang] || translations[ENGLISH_LANG] || key;
  }

  getWikiUrl(item: Item): string {
    return WIKI_URL + encodeURI(this.translate(item.name, ENGLISH_LANG));
  }
}
