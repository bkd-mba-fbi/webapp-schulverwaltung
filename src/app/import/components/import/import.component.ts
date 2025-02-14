import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ImportEmailsService } from "../../services/import-emails.service.ts.service";
import { ImportSubscriptionDetailsService } from "../../services/import-subscription-details.service";

@Component({
  selector: "bkd-import",
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrl: "./import.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ImportSubscriptionDetailsService, ImportEmailsService],
})
export class ImportComponent {}
