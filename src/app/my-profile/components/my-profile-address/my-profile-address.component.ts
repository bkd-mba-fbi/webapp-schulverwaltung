import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "erz-my-profile-address",
  templateUrl: "./my-profile-address.component.html",
  styleUrls: ["./my-profile-address.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MyProfileAddressComponent {
  @Input() address: string;

  constructor() {}
}
