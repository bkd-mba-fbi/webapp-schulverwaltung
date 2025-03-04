import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

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
  errorMessage = input<Option<string>>(null);

  valid = computed(() => this.errorMessage() === null);
  icon = computed(() => (!this.valid() ? "cancel" : "check_circle"));
}
