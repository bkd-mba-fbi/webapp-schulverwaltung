import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MyGradesService } from "../../services/my-grades.service";

@Component({
  selector: "bkd-my-grades",
  templateUrl: "./my-grades.component.html",
  styleUrls: ["./my-grades.component.scss"],
  providers: [MyGradesService],
  imports: [RouterOutlet],
})
export class MyGradesComponent {
  constructor() {}
}
