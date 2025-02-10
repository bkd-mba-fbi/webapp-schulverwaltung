import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
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
  imports: [
    MyGradesHeaderComponent,
    DossierGradesViewComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class MyGradesShowComponent {
  myGradesService = inject(MyGradesService);
}
