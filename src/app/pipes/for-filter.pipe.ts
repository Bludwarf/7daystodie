import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'forFilter'
})
export class ForFilterPipe implements PipeTransform {

  transform(items: any[], args?: any): any {
    if (args) {
      if (typeof args === 'function') {
        return items.filter(args);
      }
    }
    return items;
  }

}
