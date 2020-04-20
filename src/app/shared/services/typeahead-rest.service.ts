import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as t from 'io-ts';

import { Settings } from 'src/app/settings';
import { pick } from '../utils/types';
import { decodeArray, decode } from '../utils/decode';
import { RestService } from '../services/rest.service';
import { DropDownItem } from '../models/drop-down-item.model';

export interface TypeaheadService {
  getTypeaheadItems(term: string): Observable<ReadonlyArray<DropDownItem>>;
  getTypeaheadItemById(id: number): Observable<DropDownItem>;
}

export abstract class TypeaheadRestService<T extends t.InterfaceType<any>>
  extends RestService<T>
  implements TypeaheadService {
  protected typeaheadCodec = t.type(
    pick(this.codec.props, [this.idAttr, this.labelAttr])
  );

  constructor(
    http: HttpClient,
    settings: Settings,
    codec: T,
    resourcePath: string,
    protected labelAttr: string,
    protected idAttr = 'Id'
  ) {
    super(http, settings, codec, resourcePath);
  }

  getTypeaheadItems(term: string): Observable<ReadonlyArray<DropDownItem>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          fields: [this.idAttr, this.labelAttr].join(','),
          [`filter.${this.labelAttr}`]: `~*${term}*`,
        },
      })
      .pipe(
        switchMap(decodeArray(this.typeaheadCodec)),
        map((items) =>
          items.map((i) => ({ Key: i[this.idAttr], Value: i[this.labelAttr] }))
        )
      );
  }

  getTypeaheadItemById(id: number): Observable<DropDownItem> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}`, {
        params: {
          fields: [this.idAttr, this.labelAttr].join(','),
        },
      })
      .pipe(
        switchMap(decode(this.typeaheadCodec)),
        map((item) => ({ Key: item[this.idAttr], Value: item[this.labelAttr] }))
      );
  }
}
