import { Component, inject, signal } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { Test } from "src/app/shared/models/test.model";

@Component({
  selector: "bkd-tests-publish",
  template: `
    @let testValue = test();
    @if (testValue) {
      <div class="modal-body">
        <p data-testid="confirmation-message">
          {{
            (testValue.IsPublished
              ? "tests.publishing.unpublish"
              : "tests.publishing.publish"
            ) | translate: { designation: testValue.Designation }
          }}
        </p>
      </div>
      <div class="modal-footer">
        <button
          data-testid="cancel-button"
          type="button"
          class="btn btn-outline-secondary"
          (click)="activeModal.dismiss()"
        >
          {{ "tests.publishing.cancel" | translate }}
        </button>

        <button
          data-testid="confirm-button"
          type="button"
          class="btn btn-primary"
          (click)="activeModal.close(true)"
        >
          {{ "tests.publishing.confirm" | translate }}
        </button>
      </div>
    }
  `,
  styles: [],
  imports: [TranslatePipe],
})
export class TestsPublishComponent {
  activeModal = inject(NgbActiveModal);

  readonly test = signal<Option<Test>>(null);
}
