import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SubscriptionDetailImportEntry } from "../../services/import-validate-subscription-details.service";

@Component({
  selector: "bkd-import-entry-status",
  imports: [],
  templateUrl: "./import-entry-status.component.html",
  styleUrl: "./import-entry-status.component.scss",
  host: {
    "[class.invalid]": "!valid()",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportEntryStatusComponent {
  translate = inject(TranslateService);

  entry = input.required<SubscriptionDetailImportEntry>();

  valid = computed(() => this.entry().validationStatus !== "invalid");
  icon = computed(() =>
    this.entry().validationStatus === "invalid" ? "cancel" : "check_circle",
  );
  errorMessage = computed(() => {
    const error = this.entry().validationError;
    if (!error) return null;

    return this.translate.instant(`import.validation.errors.${error.type}`);
  });
}

// entry.validationError?.type
