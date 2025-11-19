import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class UppercasePipe implements PipeTransform {
  transform(value: string) {
    if (typeof value === 'string') {
      return value.toUpperCase().trim();
    }
    return value;
  }
}
