import { Pipe, PipeTransform } from "@angular/core";
import { I18nService } from "../services/i18n.service";

@Pipe({
  name: "addSpace",
  standalone: true,
})
export class AddSpacePipe implements PipeTransform {
  constructor(protected i18n: I18nService) {}

  transform(value: string, chars: string): string {
    const lang = this.i18n.detectLanguage();

    switch (lang) {
      case "fr-CH":
        Array.from(chars).map((c) => (value = value.replace(c, " ".concat(c))));
        return value;

      default:
        return value;
    }
  }
}
