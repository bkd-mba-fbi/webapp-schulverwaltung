import { HttpClient } from "@angular/common/http";
import * as t from "io-ts";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Settings } from "src/app/settings";
import { DropDownItem } from "../models/drop-down-item.model";
import { decode, decodeArray } from "../utils/decode";
import { pick } from "../utils/types";
import { RestService } from "./rest.service";

export class HttpParams {
  params: { [param: string]: string };
}

export interface TypeaheadService {
  getTypeaheadItems(
    term: string,
    additionalParams?: HttpParams,
  ): Observable<ReadonlyArray<DropDownItem>>;
  getTypeaheadItemByKey(key: DropDownItem["Key"]): Observable<DropDownItem>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class TypeaheadRestService<T extends t.InterfaceType<any>>
  extends RestService<T>
  implements TypeaheadService
{
  protected typeaheadCodec = t.type(
    pick(this.codec.props, [this.keyAttr, this.labelAttr]),
  );

  constructor(
    http: HttpClient,
    settings: Settings,
    codec: T,
    resourcePath: string,
    protected labelAttr: string,
    protected keyAttr = "Id",
  ) {
    super(http, settings, codec, resourcePath);
  }

  getTypeaheadItems(
    term: string,
    additionalParams?: HttpParams,
  ): Observable<ReadonlyArray<DropDownItem>> {
    const params = {
      params: {
        fields: [this.keyAttr, this.labelAttr].join(","),
        [`filter.${this.labelAttr}`]: `~*${term}*`,
      },
    };

    return this.http
      .get<unknown>(
        `${this.baseUrl}/`,
        additionalParams
          ? this.mergeHttpParams(params, additionalParams)
          : params,
      )
      .pipe(
        switchMap(decodeArray(this.typeaheadCodec)),
        map((items) =>
          items.map((i) => ({
            Key: i[this.keyAttr],
            Value: i[this.labelAttr],
          })),
        ),
      );
  }

  getTypeaheadItemByKey(key: DropDownItem["Key"]): Observable<DropDownItem> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${key}`, {
        params: {
          fields: [this.keyAttr, this.labelAttr].join(","),
        },
      })
      .pipe(
        switchMap(decode(this.typeaheadCodec)),
        map((item) => ({
          Key: item[this.keyAttr],
          Value: item[this.labelAttr],
        })),
      );
  }

  private mergeHttpParams(
    typeaheadParams: HttpParams,
    additionalParams: HttpParams,
  ): HttpParams {
    const merged = {
      params: { ...typeaheadParams.params, ...additionalParams.params },
    };
    if (additionalParams.params["fields"]) {
      merged.params["fields"] = typeaheadParams.params["fields"].concat(
        ",",
        additionalParams.params["fields"],
      );
    }
    return merged;
  }
}
