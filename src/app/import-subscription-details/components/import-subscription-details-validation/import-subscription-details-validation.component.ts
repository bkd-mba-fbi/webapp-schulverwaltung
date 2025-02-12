import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { ImportSubscriptionDetailsStateService } from "../../services/import-subscription-details-state.service";

@Component({
  selector: "bkd-import-subscription-details-validation",
  imports: [TranslatePipe, AsyncPipe, BacklinkComponent],
  templateUrl: "./import-subscription-details-validation.component.html",
  styleUrl: "./import-subscription-details-validation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsValidationComponent {
  stateService = inject(ImportSubscriptionDetailsStateService);
}
