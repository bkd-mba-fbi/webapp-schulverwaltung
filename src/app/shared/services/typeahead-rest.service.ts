import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as t from 'io-ts';

import { Settings } from 'src/app/settings';
import { pick } from '../utils/types';
import { decodeArray } from '../utils/decode';
import { TypeaheadItem } from '../models/typeahead-item';
import { RestService } from '../services/rest.service';

export interface TypeaheadService {
  getTypeaheadItems(term: string): Observable<ReadonlyArray<TypeaheadItem>>;
}

export abstract class TypeaheadRestService<T extends t.InterfaceType<any>>
  extends RestService<T>
  implements TypeaheadService {
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

  getTypeaheadItems(term: string): Observable<ReadonlyArray<TypeaheadItem>> {
    const typeaheadCodec = t.type(
      pick(this.codec.props, [this.idAttr, this.labelAttr])
    );
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          fields: [this.idAttr, this.labelAttr].join(','),
          [`filter.${this.labelAttr}`]: `~*${term}*`
        }
      })
      .pipe(
        switchMap(decodeArray(typeaheadCodec)),
        map(items =>
          items.map(i => ({ id: i[this.idAttr], label: i[this.labelAttr] }))
        )
      );
  }
}
