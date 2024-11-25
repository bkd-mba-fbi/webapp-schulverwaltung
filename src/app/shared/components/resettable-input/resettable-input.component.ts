import { Component, input, model } from "@angular/core";

@Component({
  selector: "bkd-resettable-input",
  templateUrl: "./resettable-input.component.html",
  styleUrls: ["./resettable-input.component.scss"],
  imports: [],
})
export class ResettableInputComponent {
  value = model<string>("");
  disabled = input<boolean>(false);
  placeholder = input<string>("");
  label = input<string>("");
}
