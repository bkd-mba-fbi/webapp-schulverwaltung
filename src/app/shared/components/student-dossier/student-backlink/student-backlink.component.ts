import { DatePipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { Student } from "src/app/shared/models/student.model";
import { AvatarComponent } from "../../avatar/avatar.component";
import { BacklinkComponent } from "../../backlink/backlink.component";

@Component({
  selector: "bkd-student-backlink",
  templateUrl: "./student-backlink.component.html",
  styleUrls: ["./student-backlink.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BacklinkComponent, AvatarComponent, NgIf, DatePipe],
})
export class StudentBacklinkComponent {
  @Input() link: RouterLink["routerLink"] = "/";
  @Input() queryParams?: Params;
  @Input() studentId: number;
  @Input() studentName?: string;
  @Input() student?: Student;
}
