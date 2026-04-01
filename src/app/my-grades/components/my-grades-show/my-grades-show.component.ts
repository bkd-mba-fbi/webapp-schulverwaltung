import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { StudentGradesAccordionComponent } from "../../../shared/components/student/student-grades-accordion/student-grades-accordion.component";
import { StudentGradesService } from "../../../shared/services/student-grades.service";
import { MyGradesService } from "../../services/my-grades.service";
import { MyGradesHeaderComponent } from "../my-grades-header/my-grades-header.component";

@Component({
  selector: "bkd-my-grades-show",
  templateUrl: "./my-grades-show.component.html",
  styleUrls: ["./my-grades-show.component.scss"],
  providers: [StudentGradesService],
  imports: [
    MyGradesHeaderComponent,
    StudentGradesAccordionComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class MyGradesShowComponent {
  myGradesService = inject(MyGradesService);
}
