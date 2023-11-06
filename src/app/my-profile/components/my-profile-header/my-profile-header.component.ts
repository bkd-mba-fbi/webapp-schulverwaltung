import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { ReplaySubject, map } from "rxjs";
import { Person } from "../../../shared/models/person.model";
import { ReportsService } from "../../../shared/services/reports.service";

@Component({
  selector: "erz-my-profile-header",
  templateUrl: "./my-profile-header.component.html",
  styleUrls: ["./my-profile-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileHeaderComponent implements OnChanges {
  @Input() student?: Person;

  private studentId$ = new ReplaySubject<Option<number>>(1);

  reports$ = this.studentId$.pipe(
    map((studentId) =>
      studentId
        ? this.reportsService.getPersonMasterDataReports(studentId)
        : [],
    ),
  );

  constructor(private reportsService: ReportsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.student) {
      this.studentId$.next(changes.student.currentValue?.Id || null);
    }
  }
}
