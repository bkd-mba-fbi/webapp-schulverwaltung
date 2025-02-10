import { Pipe, PipeTransform, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Test } from "src/app/shared/models/test.model";

@Pipe({
  name: "bkdTestWeight",
  standalone: true,
})
export class TestsWeightPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(input: Test): string {
    return `${this.translate.instant("tests.factor")} ${input.Weight} (${
      input.WeightPercent
    }%)`;
  }
}
