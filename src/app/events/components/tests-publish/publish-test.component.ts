import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { Test } from "src/app/shared/models/test.model";

@Component({
  selector: "bkd-publish-test",
  template: `
    <div class="modal-body">
      <p data-testid="confirmation-message">
        {{
          (test.IsPublished
            ? "tests.publishing.unpublish"
            : "tests.publishing.publish"
          ) | translate: { designation: test.Designation }
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
  `,
  styles: [],
  standalone: true,
  imports: [TranslateModule],
})
export class PublishTestComponent {
  @Input() test: Test;

  constructor(public activeModal: NgbActiveModal) {}
}
