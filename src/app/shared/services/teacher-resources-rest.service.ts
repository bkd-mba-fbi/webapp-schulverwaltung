import { Inject, Injectable } from '@angular/core';
import { TeacherResource } from '../models/teacher-resource.model';
import { HttpClient } from '@angular/common/http';
import { Settings, SETTINGS } from '../../settings';
import { TypeaheadRestService } from './typeahead-rest.service';

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
}
