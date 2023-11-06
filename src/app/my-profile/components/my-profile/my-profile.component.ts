import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MyProfileService } from "../../services/my-profile.service";

@Component({
  selector: "erz-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MyProfileService],
})
export class MyProfileComponent {
  constructor() {}
}
