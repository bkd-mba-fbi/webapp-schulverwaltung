import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Test } from "src/app/shared/models/test.model";

@Pipe({
  name: "erzTestWeight",
  standalone: true,
})
export class TestsWeightPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(input: Test): string {
    return `${this.translate.instant("tests.factor")} ${input.Weight} (${
      input.WeightPercent
    }%)`;
  }
}
