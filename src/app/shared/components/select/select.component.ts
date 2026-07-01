import { NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { DropDownItem } from "../../models/drop-down-item.model";

@Component({
  selector: "bkd-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgStyle, TranslatePipe],
})
export class SelectComponent<
  TKey extends DropDownItem["Key"] = DropDownItem["Key"],
  TValue extends DropDownItem["Value"] = DropDownItem["Value"],
> {
  readonly id = input<string>();
  readonly options =
    input.required<ReadonlyArray<{ Key: TKey; Value: TValue }>>();
  readonly allowEmpty = input(true);
  readonly emptyLabel = input("");
  readonly disabled = input(false);
  readonly isInvalid = input(false);
  readonly tabindex = input(0);
  readonly width = input("auto");

  readonly value = model<Option<TKey>>(null);

  selectedOption = computed(() => {
    const options = this.options();
    const rawValue = this.value();
    return (
      (options && options.find((o) => String(o.Key) === String(rawValue))) ||
      null
    );
  });
}
