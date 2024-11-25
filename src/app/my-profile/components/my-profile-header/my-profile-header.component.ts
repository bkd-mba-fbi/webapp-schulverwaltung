import { AsyncPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { ReplaySubject, of, startWith, switchMap } from "rxjs";
import { AvatarComponent } from "../../../shared/components/avatar/avatar.component";
import { ReportsLinkComponent } from "../../../shared/components/reports-link/reports-link.component";
import { Person } from "../../../shared/models/person.model";
import { ReportsService } from "../../../shared/services/reports.service";

@Component({
  selector: "bkd-my-profile-header",
  templateUrl: "./my-profile-header.component.html",
  styleUrls: ["./my-profile-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, ReportsLinkComponent, AsyncPipe, DatePipe],
})
export class MyProfileHeaderComponent implements OnChanges {
  @Input() student?: Person;

  private studentId$ = new ReplaySubject<Option<number>>(1);

  reports$ = this.studentId$.pipe(
    switchMap((studentId) =>
      studentId
        ? this.reportsService.getPersonMasterDataReports(studentId)
        : of([]),
    ),
    startWith([]),
  );

  constructor(private reportsService: ReportsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["student"]) {
      this.studentId$.next(changes["student"].currentValue?.Id || null);
    }
  }
}
