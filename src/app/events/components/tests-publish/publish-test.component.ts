import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-publish-test',
  template: `
    <div class="modal-body">
      <p data-testid="confirmation-message">
        {{
          (test.IsPublished
            ? 'tests.publishing.unpublish'
            : 'tests.publishing.publish'
          ) | translate: { designation: test.Designation }
        }}
      </p>
    </div>
    <div class="modal-footer">
      <button
        data-testid="cancel-button"
        type="button"
        class="btn btn-outline-primary"
        (click)="activeModal.dismiss()"
      >
        {{ 'tests.publishing.cancel' | translate }}
      </button>

      <button
        data-testid="confirm-button"
        type="button"
        class="btn btn-primary"
        (click)="activeModal.close(true)"
      >
        {{ 'tests.publishing.confirm' | translate }}
      </button>
    </div>
  `,
  styles: [],
})
export class PublishTestComponent {
  @Input() test: Test;

  constructor(public activeModal: NgbActiveModal) {}
}
