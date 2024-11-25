import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ReportsLinkComponent } from "../../../shared/components/reports-link/reports-link.component";
import { MyGradesService } from "../../services/my-grades.service";

@Component({
  selector: "bkd-my-grades-header",
  templateUrl: "./my-grades-header.component.html",
  styleUrls: ["./my-grades-header.component.scss"],
  imports: [ReportsLinkComponent, AsyncPipe, TranslatePipe],
})
export class MyGradesHeaderComponent {
  constructor(public myGradesService: MyGradesService) {}
}
