import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  input,
  output,
} from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { DropDownItem } from "../../../../shared/models/drop-down-item.model";

const DEBOUNCE_TIME = 1000; // 1 second

@Component({
  selector: "bkd-evaluation-grade",
  standalone: true,
  imports: [SelectComponent],
  templateUrl: "./evaluation-grade.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationGradeComponent implements OnDestroy {
  options = input.required<DropDownItem[]>();
  value = input.required<Option<number>>();

  valueChange = output<Option<number>>();

  private valueSubject = new Subject<Option<number>>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.valueSubject
      .pipe(debounceTime(DEBOUNCE_TIME), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.valueChange.emit(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onValueChange(value: Option<number>): void {
    this.valueSubject.next(value);
  }
}
