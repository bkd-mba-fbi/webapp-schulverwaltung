import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { SETTINGS, Settings } from "../../settings";
import { DropDownItem } from "../models/drop-down-item.model";
import { TeacherResource } from "../models/teacher-resource.model";
import { decodeArray } from "../utils/decode";
import { TypeaheadRestService } from "./typeahead-rest.service";

@Injectable({
  providedIn: "root",
})
export class TeacherResourcesRestService extends TypeaheadRestService<
  typeof TeacherResource
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(
      http,
      settings,
      TeacherResource,
      "TeacherResources",
      "FullName",
      "FullName",
    );
  }

  getTypeaheadItemByKey(key: DropDownItem["Key"]): Observable<DropDownItem> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          fields: [this.keyAttr, this.labelAttr].join(","),
          [`filter.${this.labelAttr}`]: `~*${key}*`,
        },
      })
      .pipe(
        switchMap(decodeArray(this.typeaheadCodec)),
        switchMap((items) => {
          return of({
            Key: items[0].FullName,
            Value: `${items[0].FullName}`,
          });
        }),
      );
  }
}
