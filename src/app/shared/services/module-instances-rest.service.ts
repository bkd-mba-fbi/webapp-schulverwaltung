import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SETTINGS, Settings } from '../../settings';
import { TypeaheadRestService } from './typeahead-rest.service';
import { ModuleInstance } from '../models/module-instance.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleInstancesRestService extends TypeaheadRestService<
  typeof ModuleInstance
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, ModuleInstance, 'ModuleInstances', 'Designation');
  }
}
