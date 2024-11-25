import { Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-unauthenticated",
  template: `
    <div class="bkd-container">
      <div class="alert alert-danger my-3">
        {{ "unauthenticated.message" | translate }}
      </div>
    </div>
  `,
  imports: [TranslatePipe],
})
export class UnauthenticatedComponent {
  constructor() {}
}
