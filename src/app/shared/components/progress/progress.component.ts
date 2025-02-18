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
  processed = input.required<number>();
  total = input.required<number>();
  ariaLabel = input.required<string>();

  label = computed(() => this.toLabel(this.processed(), this.total()));
  private toLabel(processed: number, total: number): string {
    return `${processed} / ${total}`;
  }
}
