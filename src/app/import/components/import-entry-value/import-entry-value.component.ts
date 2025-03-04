import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

@Component({
  selector: "bkd-import-entry-value",
  imports: [],
  templateUrl: "./import-entry-value.component.html",
  styleUrl: "./import-entry-value.component.scss",
  host: {
    "[class.invalid]": "!valid()",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportEntryValueComponent {
  value = input.required<unknown>();
  valid = input(true);

  displayValue = computed(() =>
    this.value() != null && this.value() !== "" ? String(this.value()) : "–",
  );
}
