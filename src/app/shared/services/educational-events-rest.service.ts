import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as t from "io-ts";
import { EMPTY, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { DropDownItem } from "../models/drop-down-item.model";
import { EducationalEvent } from "../models/educational-event.model";
import { decodeArray } from "../utils/decode";
import { pick } from "../utils/types";
import { RestService } from "./rest.service";
import { ToastService } from "./toast.service";
import { TypeaheadService } from "./typeahead-rest.service";

@Injectable({
  providedIn: "root",
})
export class EducationalEventsRestService
  extends RestService<typeof EducationalEvent>
  implements TypeaheadService
{
  private translate = inject(TranslateService);
  private toastService = inject(ToastService);

  protected typeaheadCodec = t.type(
    pick(this.codec.props, ["Id", "Designation", "Number"]),
  );

  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

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
