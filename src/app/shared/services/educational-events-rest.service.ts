import { Injectable, Inject, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SETTINGS, Settings } from '../../settings';
import { TypeaheadRestService } from './typeahead-rest.service';
import { EducationalEvent } from '../models/educational-event.model';
import { switchMap, map } from 'rxjs/operators';
import { decodeArray } from '../utils/decode';
import { Observable, of, EMPTY } from 'rxjs';
import { DropDownItem } from '../models/drop-down-item.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class EducationalEventsRestService extends TypeaheadRestService<
  typeof EducationalEvent
> {
  constructor(
    http: HttpClient,
    @Inject(SETTINGS) settings: Settings,
    private translate: TranslateService,
    private injector: Injector
  ) {
    super(http, settings, EducationalEvent, 'EducationalEvents', 'Designation');
  }

  getTypeaheadItems(term: string): Observable<ReadonlyArray<DropDownItem>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/CurrentSemester`, {
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
      .get<unknown>(`${this.baseUrl}/CurrentSemester`, {
        params: {
          fields: [this.idAttr, this.labelAttr].join(','),
          ['filter.Id']: `=${id}`,
        },
      })
      .pipe(
        switchMap(decodeArray(this.typeaheadCodec)),
        map((items) => {
          if (items.length === 0) {
            this.toastr.error(
              this.translate.instant(`global.rest-errors.notfound-message`),
              this.translate.instant(`global.rest-errors.notfound-title`)
            );
            return EMPTY;
          }
          return items[0];
        }),
        map((item) => ({ Key: item[this.idAttr], Value: item[this.labelAttr] }))
      );
  }

  private get toastr(): ToastrService {
    return this.injector.get(ToastrService);
  }
}
