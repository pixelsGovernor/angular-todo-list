import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByGroup'
})
export class FilterByGroupPipe implements PipeTransform {
  transform(value: object, group: string): any {
    return null;
  }

}
