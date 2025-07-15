import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import * as t from "io-ts";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { Person, PersonFullName, PersonSummary } from "../models/person.model";
import { decode, decodeArray } from "../utils/decode";
import { paginatedParams } from "../utils/pagination";
import { pick } from "../utils/types";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class PersonsRestService extends RestService<typeof Person> {
  protected personEmailCodec = t.type(
    pick(this.codec.props, ["Email", "FormOfAddress"]),
  );

  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, Person, "Persons");
  }

  getListForIds(
    personIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<Person>> {
    return this.getList({ params: { "filter.Id": `;${personIds.join(";")}` } });
  }

  getSummaries(
    ids: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<PersonSummary>> {
    if (ids.length === 0) {
      return of([]);
    }
    const params = new HttpParams()
      .set("filter.Id", `;${ids.join(";")}`)
      .set("fields", ["Id", "FullName", "DisplayEmail", "Email"].join(","));

    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: paginatedParams(0, 0, params),
      })
      .pipe(switchMap(decodeArray(PersonSummary)));
  }

  getSummariesByEmail(
    emails: ReadonlyArray<string>,
  ): Observable<ReadonlyArray<PersonSummary>> {
    if (emails.length === 0) {
      return of([]);
    }
    const params = new HttpParams()
      .set("filter.Email", `;${emails.join(";")}`)
      .set("fields", ["Id", "FullName", "DisplayEmail"].join(","));

    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: paginatedParams(0, 0, params),
      })
      .pipe(switchMap(decodeArray(PersonSummary)));
  }

  getMyself(options?: { context?: HttpContext }): Observable<Person> {
    return this.http
      .get<unknown>(`${this.baseUrl}/me`, options)
      .pipe(switchMap(decode(this.codec)));
  }

  getByIdWithEmailInfos(id: number): Observable<Person> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          "filter.Id=": id.toString(),
          fields: ["FormOfAddress", "Email"].join(","),
        },
      })
      .pipe(
        switchMap(decodeArray(this.personEmailCodec)),
        map((person) => person[0]),
      );
  }

  getFullNamesById(
    ids: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<PersonFullName>> {
    const params = new HttpParams()
      .set("filter.Id", `;${ids.join(";")}`)
      .set("fields", "Id,FullName");

    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: paginatedParams(0, 0, params),
      })
      .pipe(switchMap(decodeArray(PersonFullName)));
  }

  update(
    personId: number,
    phonePrivate: Option<string>,
    phoneMobile: Option<string>,
    email2: Maybe<string>,
  ): Observable<void> {
    const body = {
      PhonePrivate: phonePrivate,
      PhoneMobile: phoneMobile,
      Email2: email2,
    };
    return this.http
      .put<void>(`${this.baseUrl}/${personId}`, body)
      .pipe(map(() => undefined));
  }

  updateEmail(
    personId: number,
    email: string,
    context?: HttpContext,
  ): Observable<void> {
    const body = {
      Email: email,
    };
    return this.http
      .put<void>(`${this.baseUrl}/${personId}`, body, { context })
      .pipe(map(() => undefined));
  }
}
