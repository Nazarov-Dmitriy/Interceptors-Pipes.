import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AppIdValidationPipe implements PipeTransform {
  transform(id: string, metadata: ArgumentMetadata) {
    if (id.length !== 24) {
      throw new Error('invalid id ');
    }
    return id;
  }
}
