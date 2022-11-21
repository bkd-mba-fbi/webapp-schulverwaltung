import { Inject, Injectable } from '@angular/core';
import { TeacherResource } from '../models/teacher-resource.model';
import { HttpClient } from '@angular/common/http';
import { Settings, SETTINGS } from '../../settings';
import { TypeaheadRestService } from './typeahead-rest.service';
import { DropDownItem } from '../models/drop-down-item.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { decodeArray } from '../utils/decode';

@Injectable({
  providedIn: 'root',
})
export class TeacherResourcesRestService extends TypeaheadRestService<
  typeof TeacherResource
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(
      http,
      settings,
      TeacherResource,
      'TeacherResources',
      'FullName',
      'FullName'
    );
  }

  getTypeaheadItemById(id: string): Observable<DropDownItem> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          fields: [this.idAttr, this.labelAttr].join(','),
          [`filter.${this.labelAttr}`]: `~*${id}*`,
        },
      })
      .pipe(
        switchMap(decodeArray(this.typeaheadCodec)),
        switchMap((items) => {
          return of({
            Key: items[0].FullName,
            Value: `${items[0].FullName}`,
          });
        })
      );
  }
}
