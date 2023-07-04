import { Injectable, Inject } from '@angular/core';
import { Settings, SETTINGS } from '../../settings';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(@Inject(SETTINGS) private settings: Settings) {}
}
