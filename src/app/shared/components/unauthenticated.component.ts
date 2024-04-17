import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "erz-unauthenticated",
  template: `
    <div class="erz-container">
      <div class="alert alert-danger my-3">
        {{ "unauthenticated.message" | translate }}
      </div>
    </div>
  `,
  standalone: true,
  imports: [TranslateModule],
})
export class UnauthenticatedComponent {
  constructor() {}
}
