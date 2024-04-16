import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ReportsLinkComponent } from "../../../shared/components/reports-link/reports-link.component";
import { MyGradesService } from "../../services/my-grades.service";

@Component({
  selector: "erz-my-grades-header",
  templateUrl: "./my-grades-header.component.html",
  styleUrls: ["./my-grades-header.component.scss"],
  standalone: true,
  imports: [ReportsLinkComponent, AsyncPipe, TranslateModule],
})
export class MyGradesHeaderComponent {
  constructor(public myGradesService: MyGradesService) {}
}
