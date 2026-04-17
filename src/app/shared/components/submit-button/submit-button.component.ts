import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "bkd-submit-button",
  imports: [],
  templateUrl: "./submit-button.component.html",
  styleUrl: "./submit-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitButtonComponent {
  disabled = input(false);
  saving = input(false);
}
