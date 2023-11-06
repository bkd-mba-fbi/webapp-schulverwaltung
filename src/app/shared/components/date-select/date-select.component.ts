import { Component, EventEmitter, Input, Output } from "@angular/core";
import { uniqueId } from "lodash-es";

@Component({
  selector: "erz-date-select",
  templateUrl: "./date-select.component.html",
  styleUrls: ["./date-select.component.scss"],
})
export class DateSelectComponent {
  @Input() value: Option<Date> = null;
  @Input() placeholder = "shared.date-select.default-placeholder";
  @Input() minDate: Option<{ year: number; month: number; day: number }> = null;
  @Output() valueChange = new EventEmitter<Option<Date>>();

  componentId = uniqueId("erz-date-select-");

  constructor() {}
}
