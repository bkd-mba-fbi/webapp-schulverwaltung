import { Component, EventEmitter, Input, Output } from "@angular/core";
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
  @Input() value: Option<Date> = null;
  @Input() placeholder = "shared.date-select.default-placeholder";
  @Input() minDate: Option<{ year: number; month: number; day: number }> = null;
  @Output() valueChange = new EventEmitter<Option<Date>>();

  componentId = uniqueId("bkd-date-select-");

  constructor() {}
}
