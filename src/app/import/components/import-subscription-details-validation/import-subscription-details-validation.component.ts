import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { ImportSubscriptionDetailsService } from "../../services/import-subscription-details.service";

@Component({
  selector: "bkd-import-subscription-details-validation",
  imports: [TranslatePipe, BacklinkComponent],
  templateUrl: "./import-subscription-details-validation.component.html",
  styleUrl: "./import-subscription-details-validation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsValidationComponent {
  importService = inject(ImportSubscriptionDetailsService);
}
