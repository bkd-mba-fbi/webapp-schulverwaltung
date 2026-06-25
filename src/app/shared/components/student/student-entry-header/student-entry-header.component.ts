import { ChangeDetectionStrategy, Component, viewChild } from "@angular/core";
import {
  NgbAccordionButton,
  NgbAccordionHeader,
} from "@ng-bootstrap/ng-bootstrap";
import { CaretComponent } from "../../caret/caret.component";

@Component({
  selector: "bkd-student-entry-header",
  templateUrl: "./student-entry-header.component.html",
  styleUrls: ["./student-entry-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CaretComponent, NgbAccordionHeader, NgbAccordionButton],
})
export class StudentEntryHeaderComponent {
  private header = viewChild.required(NgbAccordionHeader);

  protected isCollapsed(): boolean {
    return this.header().item.collapsed;
  }
}
