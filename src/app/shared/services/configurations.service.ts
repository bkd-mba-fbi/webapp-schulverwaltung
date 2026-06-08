import { Injectable, inject } from "@angular/core";
import { map, shareReplay } from "rxjs";
import { ConfigurationsRestService } from "./configurations-rest.service";

@Injectable({
  providedIn: "root",
})
export class ConfigurationsService {
  private configurationsRestService = inject(ConfigurationsRestService);

  private schoolAppNavigation$ = this.configurationsRestService
    .getSchoolAppNavigation()
    .pipe(shareReplay(1));

  canEditInstructorEmail$ = this.schoolAppNavigation$.pipe(
    map((config) => config?.practicalTrainerActionEMail ?? false),
  );
}
