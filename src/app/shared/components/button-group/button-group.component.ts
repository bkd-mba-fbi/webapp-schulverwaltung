import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

export type ButtonGroupOption<TKey extends string = string> = {
  key: TKey;
  label: string;
};

@Component({
  selector: "bkd-button-group",
  imports: [NgClass],
  templateUrl: "./button-group.component.html",
  styleUrl: "./button-group.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent {
  options = input.required<ReadonlyArray<ButtonGroupOption>>();
  selected = model<Option<ButtonGroupOption>>(null);
}
