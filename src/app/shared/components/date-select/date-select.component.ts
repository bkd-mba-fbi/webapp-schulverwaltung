import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { uniqueId } from "lodash-es";

@Component({
  selector: "erz-date-select",
  templateUrl: "./date-select.component.html",
  styleUrls: ["./date-select.component.scss"],
  standalone: true,
  imports: [NgbInputDatepicker, FormsModule, TranslateModule],
})
export class DateSelectComponent {
  @Input() value: Option<Date> = null;
  @Input() placeholder = "shared.date-select.default-placeholder";
  @Input() minDate: Option<{ year: number; month: number; day: number }> = null;
  @Output() valueChange = new EventEmitter<Option<Date>>();

  componentId = uniqueId("erz-date-select-");

  constructor() {}
}
