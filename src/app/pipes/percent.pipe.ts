import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'percent'
})
export class PercentPipe implements PipeTransform {

  /**
   * @param value 1 -> 100 %
   * @param args
   */
  transform(value: any, args?: any): any {
    // tslint:disable-next-line:triple-equals
    if (value != 0 && !value) {
      return value;
    }

    const num = +value;
    if (isNaN(num)) {
      return `${value} %`;
    }

    const num100 = num * 100;
    let numStr = '' + num100;

    // Float approx ?
    const m = /(.*\.\d*?)(\d)(9+998)$/.exec(numStr);
    if (m) {
      numStr = m[1] + (+m[2] + 1);
    }

    return `${numStr} %`;
  }

}
