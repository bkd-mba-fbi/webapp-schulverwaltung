import { DatePipe, NgClass } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { TestSummaryShortPipe } from "src/app/events/pipes/test-summary-short.pipe";
import { CaretComponent } from "src/app/shared/components/caret/caret.component";
import { PreserveLineHeightComponent } from "src/app/shared/components/text/line/preserve-line-height.component";
import { Test } from "src/app/shared/models/test.model";

@Component({
  selector: "bkd-test-table-test-header",
  templateUrl: "./tests-table-test-header.component.html",
  styleUrls: ["./tests-table-test-header.component.scss"],
  imports: [
    NgClass,
    CaretComponent,
    PreserveLineHeightComponent,
    RouterLink,
    DatePipe,
    TranslatePipe,
    TestSummaryShortPipe,
  ],
})
export class TestTableHeaderComponent {
  readonly test = input.required<Test>();
  readonly expanded = input<boolean>(false);

  readonly toggleHeader = output<boolean>();
  readonly publish = output<Test>();
  readonly unpublish = output<Test>();

  constructor() {}

  emitToggleHeader() {
    this.toggleHeader.emit(!this.expanded());
  }

  publishTest() {
    this.publish.emit(this.test());
  }

  unpublishTest() {
    this.unpublish.emit(this.test());
  }
}
