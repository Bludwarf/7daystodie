import { Pipe, PipeTransform } from '@angular/core';
import {LocalizationService} from '../services/config/localization.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private localization: LocalizationService) { }

  transform(value: any, args?: any): any {
    return this.localization.translate(value);
  }

}
