import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, of, switchMap } from "rxjs";
import { SETTINGS, Settings } from "../../settings";
import {
  ApprenticeshipContract,
  StudentCompany,
} from "../models/apprenticeship-contract.model";
import { decodeArray } from "../utils/decode";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class ApprenticeshipContractsRestService extends RestService<
  typeof ApprenticeshipContract
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, ApprenticeshipContract, "ApprenticeshipContracts");
  }

  getCompaniesForStudents(
    studentIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<StudentCompany>> {
    if (studentIds.length === 0) {
      return of([]);
    }
    const today = new Date();
    const params: Dict<string> = {
      "filter.StudentId": `;${studentIds.join(";")}`,
      "filter.ApprenticeshipDateFrom": `<${today.toISOString()}`,
      "filter.ApprenticeshipDateTo": `>${today.toISOString()}`,
      fields: "Id,StudentId,CompanyName,CompanyNameAddition",
    };
    return this.http
      .get<unknown>(`${this.baseUrl}/`, { params })
      .pipe(switchMap(decodeArray(StudentCompany)));
  }
}
