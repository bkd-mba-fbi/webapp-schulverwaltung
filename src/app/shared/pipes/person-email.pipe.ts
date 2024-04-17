import { Pipe, PipeTransform } from "@angular/core";
import { Person } from "../../shared/models/person.model";

type PersonLike = Partial<Pick<Person, "DisplayEmail" | "Email" | "Email2">>;

@Pipe({
  name: "erzPersonEmail",
  standalone: true,
})
export class PersonEmailPipe implements PipeTransform {
  transform(input: Maybe<PersonLike>): Option<string> {
    return input?.DisplayEmail || input?.Email || input?.Email2 || null;
  }
}
