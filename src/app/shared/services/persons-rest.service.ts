import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import * as t from "io-ts";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { Person, PersonSummary } from "../models/person.model";
import { decode, decodeArray } from "../utils/decode";
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
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          "filter.Id": `;${ids.join(";")}`,
          fields: ["Id", "FullName", "DisplayEmail", "Email"].join(","),
        },
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
}
