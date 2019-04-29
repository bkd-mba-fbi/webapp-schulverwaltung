import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { RestService } from './rest.service';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsRestService extends RestService<Student> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, 'Students');
  }
}
