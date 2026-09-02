import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "bkd-my-profile-address",
  templateUrl: "./my-profile-address.component.html",
  styleUrls: ["./my-profile-address.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MyProfileAddressComponent {
  readonly address = input<string>();

  constructor() {}
}
