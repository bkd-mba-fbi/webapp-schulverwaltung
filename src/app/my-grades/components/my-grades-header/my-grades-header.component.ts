import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentGradesActionsComponent } from "src/app/shared/components/student/student-grades-actions/student-grades-actions.component";
import { MyGradesService } from "../../services/my-grades.service";

@Component({
  selector: "bkd-my-grades-header",
  templateUrl: "./my-grades-header.component.html",
  styleUrls: ["./my-grades-header.component.scss"],
  imports: [AsyncPipe, TranslatePipe, StudentGradesActionsComponent],
})
export class MyGradesHeaderComponent {
  myGradesService = inject(MyGradesService);
}
