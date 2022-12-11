import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AppBodyValidationPipe implements PipeTransform {
  transform(valueData: any, metadata: ArgumentMetadata) {
    console.log(valueData);

    for (const key of Object.keys(valueData)) {
      if (key == 'title' && valueData[key].length < 3) {
        throw new Error('Минимальная длина названия книги 3 символа!');
      }
      if (key == 'authors' && valueData[key].length < 3) {
        throw new Error('Имя автора не может быть меньше 3 символов!');
      }
    }
    return valueData;
  }
}
