import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SwitchComponent } from "../../../shared/components/switch/switch.component";

@Component({
  selector: "bkd-my-settings-notifications-toggle",
  templateUrl: "./my-settings-notifications-toggle.component.html",
  styleUrls: ["./my-settings-notifications-toggle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SwitchComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MySettingsNotificationsToggleComponent),
      multi: true,
    },
  ],
})
export class MySettingsNotificationsToggleComponent implements ControlValueAccessor {
  private cd = inject(ChangeDetectorRef);

  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly description = input<Option<string>>(null);
  readonly disabled = model(false);

  onChange = (_: boolean) => {};
  onTouched = () => {};

  private _value = false;

  get value(): boolean {
    return this._value;
  }

  set value(value: boolean) {
    this._value = value;
    this.onChange(value);
  }

  protected descriptionLines = computed(() => {
    const description = this.description();
    return description ? description.split("\n") : [];
  });

  writeValue(value: boolean): void {
    this._value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cd.markForCheck();
  }
}
