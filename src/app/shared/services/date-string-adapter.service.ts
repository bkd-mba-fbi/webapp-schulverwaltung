import { Injectable } from "@angular/core";
import { NgbDateAdapter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { DateParserFormatter } from "./date-parser-formatter";

@Injectable()
export class DateStringAdapter extends NgbDateAdapter<string> {
  private parserFormatter = new DateParserFormatter();

  /**
   * Converts a date string in the form of 'dd.MM.yyyy' to a `NgbDateStruct`.
   */
  fromModel(date: string | null): NgbDateStruct | null {
    return this.parserFormatter.parse(date ?? "");
  }

  /**
   * Converts a `NgbDateStruct` to a date string in the form of 'dd.MM.yyyy'.
   */
  toModel(date: NgbDateStruct | null): string | null {
    if (!date) return null;
    return this.parserFormatter.format(date);
  }
}
