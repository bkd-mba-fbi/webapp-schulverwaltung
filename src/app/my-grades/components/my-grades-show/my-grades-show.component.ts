import { Component } from "@angular/core";
import { DossierGradesService } from "../../../shared/services/dossier-grades.service";
import { MyGradesService } from "../../services/my-grades.service";

@Component({
  selector: "erz-my-grades-show",
  templateUrl: "./my-grades-show.component.html",
  styleUrls: ["./my-grades-show.component.scss"],
  providers: [DossierGradesService],
})
export class MyGradesShowComponent {
  constructor(public myGradesService: MyGradesService) {}
}
