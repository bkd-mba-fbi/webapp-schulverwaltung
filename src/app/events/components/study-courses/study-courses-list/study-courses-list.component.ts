import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { EventsListEntryComponent } from "src/app/events/components/common/events-list-entry/events-list-entry.component";
import { ResettableInputComponent } from "src/app/shared/components/resettable-input/resettable-input.component";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { StudyCoursesStateService } from "../../../services/study-courses-state.service";

@Component({
  selector: "bkd-study-courses-list",
  imports: [
    TranslatePipe,
    AsyncPipe,
    ResettableInputComponent,
    SpinnerComponent,
    EventsListEntryComponent,
  ],
  templateUrl: "./study-courses-list.component.html",
  styleUrl: "./study-courses-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyCoursesListComponent {
  state = inject(StudyCoursesStateService);
}
