import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { map, switchMap } from "rxjs";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { PersonsRestService } from "../../../shared/services/persons-rest.service";
import { EventsStudentsStateService } from "../../services/events-students-state.service";

@Component({
  selector: "bkd-events-students-study-course-detail",
  standalone: true,
  imports: [BacklinkComponent, DatePipe, TranslateModule],
  templateUrl: "./events-students-study-course-detail.component.html",
  styleUrl: "./events-students-study-course-detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsStudentsStudyCourseDetailComponent {
  person = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get("id")),
      switchMap((id) => this.personService.get(Number(id))),
    ),
    { initialValue: null },
  );
  studentEntry = computed(
    () =>
      this.state.entries().filter((entry) => entry.id === this.person()?.Id)[0],
  );

  constructor(
    private route: ActivatedRoute,
    private personService: PersonsRestService,
    private state: EventsStudentsStateService,
  ) {}
}
