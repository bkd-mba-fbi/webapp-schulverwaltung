import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FieldState } from "@angular/forms/signals";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-form-errors",
  imports: [TranslatePipe],
  templateUrl: "./form-errors.component.html",
  styleUrl: "./form-errors.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorsComponent<
  TValue,
  TKey extends string | number = string | number,
> {
  readonly field = input.required<FieldState<TValue, TKey>>();
  readonly submitted = input.required<boolean>();
}
