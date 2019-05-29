import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import {
  LessonDispensation,
  LessonDispensationProps
} from '../models/lesson-dispensation.model';

@Injectable({
  providedIn: 'root'
})
export class LessonDispensationsRestService extends RestService<
  LessonDispensationProps
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, LessonDispensation, 'LessonDispensations');
  }
}
