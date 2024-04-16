import { NgFor, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SwitchComponent } from "../../../shared/components/switch/switch.component";

@Component({
  selector: "erz-my-settings-notifications-toggle",
  templateUrl: "./my-settings-notifications-toggle.component.html",
  styleUrls: ["./my-settings-notifications-toggle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SwitchComponent, NgIf, NgFor],
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
  @Input() id = "";
  @Input() label = "";
  @Input() description: Option<string> = null;
  @Input() disabled = false;

  onChange = (_: boolean) => {};
  onTouched = () => {};

  private _value = false;

  constructor(private cd: ChangeDetectorRef) {}

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
