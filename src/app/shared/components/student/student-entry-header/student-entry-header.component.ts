import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { CaretComponent } from "../../caret/caret.component";

@Component({
  selector: "bkd-student-entry-header",
  templateUrl: "./student-entry-header.component.html",
  styleUrls: ["./student-entry-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CaretComponent],
})
export class StudentEntryHeaderComponent {
  readonly opened = input(false);

  constructor() {}
}
