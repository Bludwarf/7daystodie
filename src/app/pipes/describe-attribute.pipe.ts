import { Pipe, PipeTransform } from '@angular/core';
import {LocalizationService} from '../localization/localization.service';
import {DomSanitizer} from '@angular/platform-browser';
import {XmlTopObject} from '../common/xml-top-object';
import {NamedAndDescribed} from '../common/interfaces';

/**
 * Exemple d'utilisation :
 * <pre>
 * <p [title]="object.name | describeAttribute"></p>
 * </pre>
 *
 * <p>Source : <a href="https://stackoverflow.com/a/45352089/1655155">https://stackoverflow.com/a/45352089/1655155</a></p>
 *
 */
@Pipe({
  name: 'describeAttribute'
})
export class DescribeAttributePipe implements PipeTransform {

  constructor(private localization: LocalizationService) { }

  transform(value: NamedAndDescribed, lang?: string): any {
    const description = this.localization.describe(value);
    if (!description) {
      return description;
    }
    return description.replace(/\\n/g, '\n');
  }

}
