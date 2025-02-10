import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { SETTINGS, Settings } from "../../settings";
import { TeacherSubstitution } from "../models/teacher-substitution.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class TeacherSubstitutionsRestService extends RestService<
  typeof TeacherSubstitution
> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, TeacherSubstitution, "TeacherSubstitutions");
  }

  getTeacherSubstitution(
    substitutionId: number,
  ): Observable<Option<TeacherSubstitution>> {
    return this.getList({ params: { "filter.Id": `=${substitutionId}` } }).pipe(
      map((substitutions) => substitutions[0] || null),
    );
  }
}
