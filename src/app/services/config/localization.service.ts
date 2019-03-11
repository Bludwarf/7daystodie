import { Injectable } from '@angular/core';
import TOKENS from 'src/assets/Data/Config/Localization.txt.json';

const DEFAULT_LANG = 'French';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  constructor() { }

  translate(key: string, lang = DEFAULT_LANG): string {
    const translations = TOKENS[key];
    return translations && lang in translations ? translations[lang] : key;
  }
}
