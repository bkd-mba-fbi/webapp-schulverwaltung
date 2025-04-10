import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MyProfileService } from "../../services/my-profile.service";

@Component({
  selector: "bkd-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  providers: [MyProfileService],
})
export class MyProfileComponent {
  constructor() {}
}
