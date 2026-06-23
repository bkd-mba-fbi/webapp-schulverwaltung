import { AsyncPipe } from "@angular/common";
import { HttpContext } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { Observable, combineLatest, map, of, switchMap } from "rxjs";
import { RestErrorInterceptorOptions } from "src/app/shared/interceptors/rest-error.interceptor";
import { ConfigurationsService } from "src/app/shared/services/configurations.service";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { isEmail } from "src/app/shared/utils/email";
import { catch404 } from "src/app/shared/utils/observable";
import { SETTINGS, Settings } from "../../../settings";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardActionComponent } from "../dashboard-action/dashboard-action.component";
import { DashboardDeadlineComponent } from "../dashboard-deadline/dashboard-deadline.component";

@Component({
  selector: "bkd-dashboard-actions",
  templateUrl: "./dashboard-actions.component.html",
  styleUrls: ["./dashboard-actions.component.scss"],
  imports: [
    DashboardActionComponent,
    DashboardDeadlineComponent,
    AsyncPipe,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardActionsComponent {
  dashboardService = inject(DashboardService);
  settings = inject<Settings>(SETTINGS);
  private configurationsService = inject(ConfigurationsService);
  private personsService = inject(PersonsRestService);
  private storageService = inject(StorageService);

  canEditInstructorEmail = toSignal(this.loadCanEditInstructorEmail(), {
    initialValue: false,
  });

  get substitutionsAdminLink(): string {
    return this.settings.dashboard.substitutionsAdminLink;
  }

  private loadCanEditInstructorEmail(): Observable<boolean> {
    return this.dashboardService.hasStudentRole$.pipe(
      switchMap((hasStudentRole) => {
        if (!hasStudentRole) return of(false);

        return combineLatest([
          this.configurationsService.canEditInstructorEmail$,
          this.loadInstructorEmailValue(),
        ]).pipe(
          map(([canEdit, value]) => canEdit && (!value || isEmail(value))),
        );
      }),
    );
  }

  private loadInstructorEmailValue(): Observable<unknown> {
    const studentId = this.storageService.getPayload()?.id_person;
    return studentId
      ? this.personsService
          .getInstructorEmail(
            Number(studentId),
            new HttpContext().set(RestErrorInterceptorOptions, {
              disableErrorHandlingForStatus: [404],
            }),
          )
          .pipe(catch404())
      : of(null);
  }
}
