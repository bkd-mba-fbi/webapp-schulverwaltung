import { PipeTransform, Pipe } from '@angular/core';
import { Person } from '../../shared/models/person.model';

@Pipe({
  name: 'erzPersonEmail',
})
export class PersonEmailPipe implements PipeTransform {
  transform(input: Person): Option<string> {
    return input.DisplayEmail || input.Email || input.Email2 || null;
  }
}
