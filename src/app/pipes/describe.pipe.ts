import { Pipe, PipeTransform } from '@angular/core';
import {LocalizationService} from '../localization/localization.service';
import {DomSanitizer} from '@angular/platform-browser';

/**
 * Exemple d'utilisation :
 * <pre>
 * <p [innerHTML]="object.name | describe"></p>
 * </pre>
 *
 * <p>Attention à ne pas utiliser cette version si la description contient des caractères HTML :</p>
 *
 * <pre>
 * <p>
 *     {{object.name | describe}}
 * </p>
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

  transform(value: string, lang?: string): any {
    const description = this.localization.describe(value);
    if (!description) {
      return description;
    }
    return this.sanitizer.bypassSecurityTrustHtml(description.replace('\\n', '<br/>'));
  }

}
