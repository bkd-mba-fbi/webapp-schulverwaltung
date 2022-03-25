import { Component, Input } from '@angular/core';

@Component({
  selector: 'erz-test-state',
  template: `
    <a
      class="d-flex btn btn-link pl-0"
      [ngClass]="{ edit: published }"
      title="{{ actionTranslationKey() | translate }}"
    >
      <i class="material-icons mr-1">lock_open</i>
      <span>{{ stateTranslationKey() | translate }}</span>
    </a>
  `,
  styles: [
    `
      .edit {
        color: rgba($body-color, 0.5);
      }
    `,
  ],
})
export class TestStateComponent {
  @Input() published: boolean;

  constructor() {}

  actionTranslationKey() {
    return this.published ? 'tests.edit' : 'tests.publish';
  }
  stateTranslationKey() {
    return this.published ? 'tests.published' : 'tests.not-published';
  }
}
