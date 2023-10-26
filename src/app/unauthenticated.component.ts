import { Component } from "@angular/core";

@Component({
  selector: "erz-unauthenticated",
  template: `
    <div class="erz-container">
      <div class="alert alert-danger my-3">
        {{ "unauthenticated.message" | translate }}
      </div>
    </div>
  `,
})
export class UnauthenticatedComponent {
  constructor() {}
}
