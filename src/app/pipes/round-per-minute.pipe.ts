import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundPerMinute'
})
export class RoundPerMinutePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value !== undefined ? value + ' rpm' : undefined;
  }

}
