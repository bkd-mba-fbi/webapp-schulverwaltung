import { Pipe, PipeTransform } from "@angular/core";
import { Person } from "../../shared/models/person.model";

@Pipe({
  name: "erzPersonEmail",
  standalone: true,
})
export class PersonEmailPipe implements PipeTransform {
  transform(input: Maybe<Person>): Option<string> {
    return input?.DisplayEmail || input?.Email || input?.Email2 || null;
  }
}
