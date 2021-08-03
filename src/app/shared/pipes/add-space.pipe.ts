import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Pipe({
  name: 'addSpace',
})
export class AddSpacePipe implements PipeTransform {
  constructor(protected i18n: I18nService) {}

  transform(value: string): string {
    const lang = this.i18n.detectLanguage();

    switch (lang) {
      case 'fr-CH':
        return value.replace(':', ' :');

      default:
        return value;
    }
  }
}
