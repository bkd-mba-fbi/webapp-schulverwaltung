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
  id = input<string>();
  options = input.required<ReadonlyArray<{ Key: TKey; Value: TValue }>>();
  allowEmpty = input(true);
  emptyLabel = input("");
  disabled = input(false);
  isInvalid = input(false);
  tabindex = input(0);
  width = input("auto");

  value = model<Option<TKey>>(null);

  selectedOption = computed(() => {
    const options = this.options();
    const rawValue = this.value();
    return (
      (options && options.find((o) => String(o.Key) === String(rawValue))) ||
      null
    );
  });
}
