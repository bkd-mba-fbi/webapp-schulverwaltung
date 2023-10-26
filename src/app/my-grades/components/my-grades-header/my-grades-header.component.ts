import { Component } from "@angular/core";
import { MyGradesService } from "../../services/my-grades.service";

@Component({
  selector: "erz-my-grades-header",
  templateUrl: "./my-grades-header.component.html",
  styleUrls: ["./my-grades-header.component.scss"],
})
export class MyGradesHeaderComponent {
  constructor(public myGradesService: MyGradesService) {}
}
