import { Component, EventEmitter, Output, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { uniqueId } from "lodash-es";

@Component({
  selector: "bkd-date-select",
  templateUrl: "./date-select.component.html",
  styleUrls: ["./date-select.component.scss"],
  imports: [NgbInputDatepicker, FormsModule, TranslatePipe],
})
export class DateSelectComponent {
  readonly value = input<Option<Date>>(null);
  readonly placeholder = input("shared.date-select.default-placeholder");
  readonly minDate = input<
    Option<{
      year: number;
      month: number;
      day: number;
    }>
  >(null);
  @Output() valueChange = new EventEmitter<Option<Date>>();

  componentId = uniqueId("bkd-date-select-");

  constructor() {}
}
