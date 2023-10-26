import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { SETTINGS, Settings } from "../../settings";
import { TypeaheadService } from "./typeahead-rest.service";
import { EducationalEvent } from "../models/educational-event.model";
import { switchMap, map } from "rxjs/operators";
import { decodeArray } from "../utils/decode";
import { Observable, EMPTY, of } from "rxjs";
import { DropDownItem } from "../models/drop-down-item.model";
import { TranslateService } from "@ngx-translate/core";
import { pick } from "../utils/types";
import { RestService } from "./rest.service";
import * as t from "io-ts";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: "root",
})
export class EducationalEventsRestService
  extends RestService<typeof EducationalEvent>
  implements TypeaheadService
{
  protected typeaheadCodec = t.type(
    pick(this.codec.props, ["Id", "Designation", "Number"]),
  );

  constructor(
    http: HttpClient,
    @Inject(SETTINGS) settings: Settings,
    private translate: TranslateService,
    private toastService: ToastService,
  ) {
    super(http, settings, EducationalEvent, "EducationalEvents");
  }

  getTypeaheadItems(term: string): Observable<ReadonlyArray<DropDownItem>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/CurrentSemester`, {
        params: {
          fields: ["Id", "Designation", "Number"].join(","),
          ["filter.Designation"]: `~*${term}*`,
        },
      })
      .pipe(
        switchMap(decodeArray(this.typeaheadCodec)),
        map((items) =>
          items.map((i) => ({
            Key: i.Id,
            Value: `${i.Designation} (${i.Number})`,
          })),
        ),
      );
  }

  getTypeaheadItemByKey(key: DropDownItem["Key"]): Observable<DropDownItem> {
    return this.http
      .get<unknown>(`${this.baseUrl}/CurrentSemester`, {
        params: {
          fields: ["Id", "Designation", "Number"].join(","),
          ["filter.Id"]: `=${key}`,
        },
      })
      .pipe(
        switchMap(decodeArray(this.typeaheadCodec)),
        switchMap((items) => {
          if (items.length === 0) {
            this.toastService.error(
              this.translate.instant(`global.rest-errors.notfound-message`),
              this.translate.instant(`global.rest-errors.notfound-title`),
            );
            return EMPTY as Observable<DropDownItem>;
          }
          return of({
            Key: items[0].Id,
            Value: `${items[0].Designation} (${items[0].Number})`,
          });
        }),
      );
  }
}
