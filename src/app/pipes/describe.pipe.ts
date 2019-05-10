import { Pipe, PipeTransform } from '@angular/core';
import {LocalizationService} from '../localization/localization.service';

@Pipe({
  name: 'describe'
})
export class DescribePipe implements PipeTransform {

  constructor(private localization: LocalizationService) { }

  transform(value: string, lang?: string): any {
    return this.localization.describe(value);
  }

}
