import { Injectable } from "@angular/core";
import { format, parse } from "date-fns";
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class DateParserFormatter extends NgbDateParserFormatter {
  /**
   * The default implementation uses non-strict type checking and expects `null` to be returned if the value can't be parsed.
   */
  parse(value: string): NgbDateStruct {
    const date = value ? parse(value, "dd.MM.yyyy", new Date()) : null;
    if (date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay(),
      };
    }
    return null as unknown as NgbDateStruct;
  }
  /**
   * The default implementation uses non-strict type checking and expects an empty string to be returned if the given date is `null`.
   */
  format(date: NgbDateStruct): string {
    return date
      ? format(new Date(date.year, date.month - 1, date.day), "dd.MM.yyyy")
      : "";
  }
}
