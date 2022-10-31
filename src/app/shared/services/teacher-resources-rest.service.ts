import { Inject, Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { TeacherResource } from '../models/teacher-resource.model';
import { HttpClient } from '@angular/common/http';
import { Settings, SETTINGS } from '../../settings';

@Injectable({
  providedIn: 'root',
})
export class TeacherResourcesRestService extends RestService<
  typeof TeacherResource
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, TeacherResource, 'TeacherResources');
  }
}
