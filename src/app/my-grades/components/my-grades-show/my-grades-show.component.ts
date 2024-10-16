import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { DossierGradesViewComponent } from "../../../shared/components/student-dossier/dossier-grades-view/dossier-grades-view.component";
import { DossierGradesService } from "../../../shared/services/dossier-grades.service";
import { MyGradesService } from "../../services/my-grades.service";
import { MyGradesHeaderComponent } from "../my-grades-header/my-grades-header.component";

@Component({
  selector: "bkd-my-grades-show",
  templateUrl: "./my-grades-show.component.html",
  styleUrls: ["./my-grades-show.component.scss"],
  providers: [DossierGradesService],
  standalone: true,
  imports: [
    MyGradesHeaderComponent,
    DossierGradesViewComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class MyGradesShowComponent {
  constructor(public myGradesService: MyGradesService) {}
}
