import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'erz-unauthenticated',
  template: `
    <div class="erz-container">
      <div class="alert alert-danger my-3">
        {{ 'unauthenticated.message' | translate }}
      </div>
    </div>
  `,
})
export class UnauthenticatedComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
