import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MyProfileService } from "../../services/my-profile.service";

@Component({
  selector: "erz-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
  providers: [MyProfileService],
})
export class MyProfileComponent {
  constructor() {}
}
