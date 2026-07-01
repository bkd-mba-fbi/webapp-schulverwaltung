import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

@Component({
  selector: "bkd-progress",
  imports: [],
  templateUrl: "./progress.component.html",
  styleUrl: "./progress.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  readonly processed = input.required<number>();
  readonly total = input.required<number>();
  readonly ariaLabel = input.required<string>();

  percentage = computed(() =>
    this.total() > 0 ? (this.processed() / this.total()) * 100 : 0,
  );
  label = computed(() => this.toLabel(this.processed(), this.total()));

  private toLabel(processed: number, total: number): string {
    return `${processed} / ${total}`;
  }
}
