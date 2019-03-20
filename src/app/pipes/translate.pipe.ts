import { Pipe, PipeTransform } from '@angular/core';
import {LocalizationService} from '../localization/localization.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private localization: LocalizationService) { }

  transform(value: any, lang?: string): any {
    return this.localization.translate(value, lang);
  }

}
