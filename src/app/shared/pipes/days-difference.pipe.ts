import { Pipe, PipeTransform, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { differenceInCalendarDays } from "date-fns";

@Pipe({
  name: "bkdDaysDifference",
  standalone: true,
})
export class DaysDifferencePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(input: Maybe<Date>): string {
    if (!input) {
      return "";
    }
    const difference = differenceInCalendarDays(input, new Date());
    return this.translate.instant(
      `shared.daysDifference.${this.getKey(difference)}`,
      {
        count: Math.abs(difference),
      },
    );
  }

  private getKey(daysDifference: number): string {
    if (daysDifference === 0) {
      return "today";
    } else if (daysDifference === 1) {
      return "tomorrow";
    } else if (daysDifference === -1) {
      return "yesterday";
    } else if (daysDifference > 0) {
      return "in";
    }
    return "ago";
  }
}
