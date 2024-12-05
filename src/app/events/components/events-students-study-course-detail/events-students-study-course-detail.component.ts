import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { map, switchMap } from "rxjs";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { PersonsRestService } from "../../../shared/services/persons-rest.service";

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

  constructor(
    private route: ActivatedRoute,
    private personService: PersonsRestService,
  ) {}
}
