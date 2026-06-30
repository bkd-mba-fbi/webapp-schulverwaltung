import { Component, computed, inject, input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { Test } from "../../../../shared/models/test.model";

@Component({
  selector: "bkd-tests-delete",
  templateUrl: "./tests-delete.component.html",
  styleUrls: ["./tests-delete.component.scss"],
  imports: [TranslatePipe],
})
export class TestsDeleteComponent {
  activeModal = inject(NgbActiveModal);

  readonly test = input.required<Test>();

  canDeleteTest = computed(() => {
    const testsExists =
      this.test()?.Results?.filter(
        (test) =>
          test.GradeId !== null ||
          test.GradeValue !== null ||
          test.Points !== null,
      ) || [];
    return testsExists.length === 0 ? true : false;
  });
}
