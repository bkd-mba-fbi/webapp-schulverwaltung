import { AsyncPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { of, startWith, switchMap } from "rxjs";
import { AvatarEditComponent } from "../../../shared/components/avatar-edit/avatar-edit.component";
import { ReportsLinkComponent } from "../../../shared/components/reports-link/reports-link.component";
import { Person } from "../../../shared/models/person.model";
import { ReportsService } from "../../../shared/services/reports.service";

@Component({
  selector: "bkd-my-profile-header",
  templateUrl: "./my-profile-header.component.html",
  styleUrls: ["./my-profile-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarEditComponent, ReportsLinkComponent, AsyncPipe, DatePipe],
})
export class MyProfileHeaderComponent {
  private reportsService = inject(ReportsService);

  person = input<Person>();
  personId = computed(() => this.person()?.Id ?? null);

  reports$ = toObservable(this.personId).pipe(
    switchMap((personId) =>
      personId
        ? this.reportsService.getPersonMasterDataReports(personId)
        : of([]),
    ),
    startWith([]),
  );
}
