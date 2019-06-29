import { Pipe, PipeTransform } from '@angular/core';
import {LocalizationService} from '../localization/localization.service';
import {DomSanitizer} from '@angular/platform-browser';
import {XmlTopObject} from '../common/xml-top-object';
import {NamedAndDescribed} from '../common/interfaces';

/**
 * Exemple d'utilisation :
 * <pre>
 * <p>
 *     {{object.name | describe}}
 * </p>
 * </pre>
 *
 * <p>Attention à ne pas utiliser cette version si on décrit un attribut HTML :</p>
 *
 * <pre>
 * <p [title]="object.name | describeAttribute"></p>
 * </pre>
 *
 * <p>Source : <a href="https://stackoverflow.com/a/45352089/1655155">https://stackoverflow.com/a/45352089/1655155</a></p>
 *
 */
@Pipe({
  name: 'describe'
})
export class DescribePipe implements PipeTransform {

  constructor(private localization: LocalizationService, private sanitizer: DomSanitizer) { }

  transform(value: NamedAndDescribed, lang?: string): any {
    const description = this.localization.describe(value);
    if (!description) {
      return description;
    }
    if (description.indexOf('\\n') === -1) {
      return description;
    }
    return this.sanitizer.bypassSecurityTrustHtml(description.replace(/\\n/g, '<br/>'));
  }

}
