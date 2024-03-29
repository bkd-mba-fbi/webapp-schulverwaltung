import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
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
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
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
