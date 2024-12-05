import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { TypeaheadComponent } from "../../../shared/components/typeahead/typeahead.component";
import { EducationalEventsRestService } from "../../../shared/services/educational-events-rest.service";
import { EvaluateAbsencesFilter } from "../../services/evaluate-absences-state.service";

@Component({
  selector: "bkd-evaluate-absences-header",
  templateUrl: "./evaluate-absences-header.component.html",
  styleUrls: ["./evaluate-absences-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TypeaheadComponent, TranslatePipe],
})
export class EvaluateAbsencesHeaderComponent {
  @Input()
  filter: EvaluateAbsencesFilter = {
    student: null,
    educationalEvent: null,
    studyClass: null,
  };

  @Output() filterChange = new EventEmitter<EvaluateAbsencesFilter>();

  constructor(
    public studentsService: StudentsRestService,
    public educationalEventsService: EducationalEventsRestService,
    public studyClassesService: StudyClassesRestService,
  ) {}

  classesHttpFilter = {
    params: {
      fields: "IsActive",
      ["filter.IsActive"]: "=true",
    },
  };

  show(): void {
    this.filterChange.emit(this.filter);
  }
}
