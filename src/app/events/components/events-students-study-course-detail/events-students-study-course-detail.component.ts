import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AvatarComponent } from "../../../shared/components/avatar/avatar.component";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";

@Component({
  selector: "bkd-events-students-study-course-detail",
  standalone: true,
  imports: [BacklinkComponent, AvatarComponent],
  templateUrl: "./events-students-study-course-detail.component.html",
  styleUrl: "./events-students-study-course-detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsStudentsStudyCourseDetailComponent {
  constructor(private route: ActivatedRoute) {}
}
