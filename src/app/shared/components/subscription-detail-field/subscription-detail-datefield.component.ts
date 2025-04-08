import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbInputDatepicker,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { isValid, parse } from "date-fns";
import { Subject, takeUntil } from "rxjs";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { DateParserFormatter } from "../../services/date-parser-formatter";
import { DateStringAdapter } from "../../services/date-string-adapter.service";

const DATE_FORMAT = "dd.MM.yyyy";

@Component({
  selector: "bkd-subscription-detail-datefield",
  imports: [FormsModule, NgbInputDatepicker, TranslatePipe],
  providers: [
    { provide: NgbDateAdapter, useClass: DateStringAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
  template: `
    <div class="input-group">
      <span class="input-group-text" [id]="id()"
        ><i class="material-icons">calendar_today</i></span
      >
      <input
        class="form-control"
        type="text"
        ngbDatepicker
        #dp="ngbDatepicker"
        [id]="id()"
        [placeholder]="'shared.date-select.default-placeholder' | translate"
        [disabled]="readonly()"
        [ngModel]="value()"
        (ngModelChange)="onChange($event)"
        (blur)="onBlur()"
        (click)="dp.toggle()"
      />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailDatefieldComponent
  implements AfterViewInit, OnDestroy
{
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  commit = output<SubscriptionDetail>();

  readonly = computed(() => this.detail().VssInternet === "R");
  value = computed(() =>
    this.detail().Value ? String(this.detail().Value) : null,
  );

  private datepicker = viewChild.required(NgbInputDatepicker);
  private destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    this.datepicker()
      .dateSelect.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onSelect());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onChange(value: Option<string>): void {
    this.updateDetailValue(value);
  }

  onBlur(): void {
    // To not overwrite the user's input, while editing the date string, the
    // value can temporarlily be an invalid string. In this case, we set it to
    // `null` on blur.
    const date = parse(String(this.detail().Value), DATE_FORMAT, new Date());
    if (!isValid(date)) {
      this.updateDetailValue(null);
    }

    this.commit.emit(this.detail());
  }

  onSelect(): void {
    this.commit.emit(this.detail());
  }

  private updateDetailValue(value: SubscriptionDetail["Value"]) {
    this.detail.set({
      ...this.detail(),
      Value: value,
    });
  }
}
