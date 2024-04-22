import { DatePipe, NgClass, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Test } from "src/app/shared/models/test.model";
import { CaretComponent } from "../../../shared/components/caret/caret.component";
import { PreserveLineHeightComponent } from "../../../shared/components/text/line/preserve-line-height.component";
import { TestSummaryShortPipe } from "../../pipes/test-summary-short.pipe";

@Component({
  selector: "bkd-test-table-header",
  templateUrl: "./test-table-header.component.html",
  styleUrls: ["./test-table-header.component.scss"],
  standalone: true,
  imports: [
    NgClass,
    CaretComponent,
    NgIf,
    PreserveLineHeightComponent,
    RouterLink,
    DatePipe,
    TranslateModule,
    TestSummaryShortPipe,
  ],
})
export class TestTableHeaderComponent {
  @Input() test: Test;
  @Input() expanded: boolean;

  @Output() toggle = new EventEmitter<boolean>();
  @Output() publish = new EventEmitter<Test>();
  @Output() unpublish = new EventEmitter<Test>();

  constructor() {}

  toggleHeader() {
    this.toggle.emit(!this.expanded);
  }

  publishTest() {
    this.publish.emit(this.test);
  }

  unpublishTest() {
    this.unpublish.emit(this.test);
  }
}
