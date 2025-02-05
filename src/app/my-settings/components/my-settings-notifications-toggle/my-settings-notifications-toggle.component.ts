import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  forwardRef,
  inject,
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
export class MySettingsNotificationsToggleComponent
  implements ControlValueAccessor
{
  private cd = inject(ChangeDetectorRef);

  @Input() id = "";
  @Input() label = "";
  @Input() description: Option<string> = null;
  @Input() disabled = false;

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

  get descriptionLines(): ReadonlyArray<string> {
    return this.description ? this.description.split("\n") : [];
  }

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
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }
}
