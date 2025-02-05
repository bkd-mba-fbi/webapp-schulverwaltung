import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { Student } from "src/app/shared/models/student.model";
import { AvatarComponent } from "../../avatar/avatar.component";
import { BacklinkComponent } from "../../backlink/backlink.component";

@Component({
  selector: "bkd-student-backlink",
  templateUrl: "./student-backlink.component.html",
  styleUrls: ["./student-backlink.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BacklinkComponent, AvatarComponent, DatePipe],
})
export class StudentBacklinkComponent {
  readonly link = input<RouterLink["routerLink"]>("/");
  readonly queryParams = input<Params>();
  readonly studentId = input<number>();
  readonly studentName = input<string>();
  @Input() student?: Student;
}
